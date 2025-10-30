/**
 * ZKx401 Persistent Memory System
 * Dual-tier memory architecture: Working Memory + Context Memory
 */

export interface ContextMemory {
  [key: string]: any;
}

export interface WorkingMemory {
  // Short-term data (session lifetime)
  sessionId: string;
  temporaryData: Map<string, any>;
  activeContexts: Set<string>;
  lastActivity: Date;
}

export interface ContextMemoryStore {
  // Persistent data (cross-session)
  contextId: string;
  memories: Map<string, any>;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    accessCount: number;
    ttl?: number; // Time to live in milliseconds
  };
}

export class MemoryManager {
  private workingMemory: WorkingMemory;
  private contextMemories: Map<string, ContextMemoryStore> = new Map();
  private persistenceLayer: MemoryPersistence;

  constructor(sessionId: string) {
    this.workingMemory = {
      sessionId,
      temporaryData: new Map(),
      activeContexts: new Set(),
      lastActivity: new Date()
    };
    this.persistenceLayer = new MemoryPersistence();
  }

  /**
   * Store data in working memory (temporary)
   */
  setWorkingMemory(key: string, value: any): void {
    this.workingMemory.temporaryData.set(key, value);
    this.workingMemory.lastActivity = new Date();
  }

  /**
   * Retrieve data from working memory
   */
  getWorkingMemory(key: string): any {
    this.workingMemory.lastActivity = new Date();
    return this.workingMemory.temporaryData.get(key);
  }

  /**
   * Store data in context memory (persistent)
   */
  async setContextMemory(
    contextId: string, 
    key: string, 
    value: any, 
    ttl?: number
  ): Promise<void> {
    let store = this.contextMemories.get(contextId);
    
    if (!store) {
      store = {
        contextId,
        memories: new Map(),
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          accessCount: 0
        }
      };
      this.contextMemories.set(contextId, store);
    }

    store.memories.set(key, value);
    store.metadata.updatedAt = new Date();
    store.metadata.accessCount++;
    
    if (ttl) {
      store.metadata.ttl = ttl;
      // Schedule cleanup
      setTimeout(() => {
        this.cleanupExpiredMemory(contextId, key);
      }, ttl);
    }

    // Persist to storage
    await this.persistenceLayer.persistContextMemory(contextId, store);
  }

  /**
   * Retrieve data from context memory
   */
  async getContextMemory(contextId: string, key: string): Promise<any> {
    const store = this.contextMemories.get(contextId);
    if (!store) {
      // Try to load from persistence
      const loadedStore = await this.persistenceLayer.loadContextMemory(contextId);
      if (loadedStore) {
        this.contextMemories.set(contextId, loadedStore);
        return loadedStore.memories.get(key);
      }
      return undefined;
    }

    // Check TTL
    if (store.metadata.ttl) {
      const age = Date.now() - store.metadata.updatedAt.getTime();
      if (age > store.metadata.ttl) {
        await this.deleteContextMemory(contextId, key);
        return undefined;
      }
    }

    store.metadata.accessCount++;
    return store.memories.get(key);
  }

  /**
   * Delete data from context memory
   */
  async deleteContextMemory(contextId: string, key: string): Promise<void> {
    const store = this.contextMemories.get(contextId);
    if (store) {
      store.memories.delete(key);
      await this.persistenceLayer.persistContextMemory(contextId, store);
    }
  }

  /**
   * Get all context memory keys
   */
  getContextMemoryKeys(contextId: string): string[] {
    const store = this.contextMemories.get(contextId);
    return store ? Array.from(store.memories.keys()) : [];
  }

  /**
   * Activate a context
   */
  activateContext(contextId: string): void {
    this.workingMemory.activeContexts.add(contextId);
  }

  /**
   * Deactivate a context
   */
  deactivateContext(contextId: string): void {
    this.workingMemory.activeContexts.delete(contextId);
  }

  /**
   * Get active contexts
   */
  getActiveContexts(): string[] {
    return Array.from(this.workingMemory.activeContexts);
  }

  /**
   * Cleanup expired memory
   */
  private async cleanupExpiredMemory(contextId: string, key: string): Promise<void> {
    await this.deleteContextMemory(contextId, key);
  }

  /**
   * Get memory statistics
   */
  getMemoryStats(): {
    workingMemory: {
      sessionId: string;
      temporaryDataSize: number;
      activeContextsCount: number;
      lastActivity: Date;
    };
    contextMemories: Array<{
      contextId: string;
      memoryCount: number;
      totalSize: number;
      lastUpdated: Date;
      accessCount: number;
    }>;
  } {
    return {
      workingMemory: {
        sessionId: this.workingMemory.sessionId,
        temporaryDataSize: this.workingMemory.temporaryData.size,
        activeContextsCount: this.workingMemory.activeContexts.size,
        lastActivity: this.workingMemory.lastActivity
      },
      contextMemories: Array.from(this.contextMemories.entries()).map(([id, store]) => ({
        contextId: id,
        memoryCount: store.memories.size,
        totalSize: JSON.stringify(Array.from(store.memories.values())).length,
        lastUpdated: store.metadata.updatedAt,
        accessCount: store.metadata.accessCount
      }))
    };
  }
}

/**
 * Memory persistence layer (abstracted for different storage backends)
 */
class MemoryPersistence {
  // In a real implementation, this would connect to:
  // - Database (PostgreSQL, MongoDB, etc.)
  // - File system
  // - Cloud storage (S3, etc.)
  // - Redis for caching
  
  async persistContextMemory(contextId: string, store: ContextMemoryStore): Promise<void> {
    // For demo purposes, we'll use localStorage simulation
    // In production, this would be a proper database call
    const key = `zkx401_context_memory_${contextId}`;
    const data = {
      ...store,
      memories: Object.fromEntries(store.memories)
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  async loadContextMemory(contextId: string): Promise<ContextMemoryStore | null> {
    const key = `zkx401_context_memory_${contextId}`;
    
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...parsed,
          memories: new Map(Object.entries(parsed.memories || {}))
        };
      }
    }
    
    return null;
  }
}

// Export memory manager factory
export function createMemoryManager(sessionId: string): MemoryManager {
  return new MemoryManager(sessionId);
}

export default MemoryManager;