// ZKx401 Core Types - Daydreams-inspired Architecture
import { z } from 'zod';

// Base context interface
export interface ContextBase<TMemory extends Record<string, any> = Record<string, any>, TArgs = Record<string, any>> {
  type: string;
  schema?: z.ZodType<TArgs>;
  memory: TMemory;
  args: TArgs;
  instructions?: string | ((state: ContextState<TMemory, TArgs>) => string);
}

// Context state interface
export interface ContextState<TMemory extends Record<string, any> = Record<string, any>, TArgs = Record<string, any>> {
  type: string;
  memory: TMemory;
  args: TArgs;
  instructions?: string;
}

// Action interface
export interface Action<TCtx extends ContextBase = ContextBase, TInput = any, TOutput = any> {
  name: string;
  description?: string;
  schema?: z.ZodType<TInput>;
  handler: (input: TInput, ctx: TCtx) => Promise<TOutput>;
}

// Context composition interface
export interface ContextComposition<TCtx extends ContextBase = ContextBase, TArgs = Record<string, any>> {
  context: ContextBase<any, any>;
  args?: TArgs;
  condition?: (state: ContextState<any, any>) => boolean;
}

// Memory interfaces
export interface WorkingMemory {
  inputs: any[];
  outputs: any[];
  actions: any[];
  sessionId: string;
  timestamp: number;
}

export interface PersistentMemory {
  userPreferences: Record<string, any>;
  agentHistory: any[];
  conversationState: Record<string, any>;
  transactionHistory: any[];
}

// AI Provider interfaces
export interface AIProvider {
  name: string;
  model: string;
  apiKey: string;
  endpoint?: string;
  headers?: Record<string, string>;
}

// MCP Tool interfaces
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  handler: (input: any) => Promise<any>;
}

export interface MCPConnection {
  id: string;
  name: string;
  type: 'stdio' | 'http' | 'websocket';
  command?: string;
  args?: string[];
  serverUrl?: string;
  headers?: Record<string, string>;
  tools: MCPTool[];
}

// Payment interfaces
export interface PaymentConfig {
  amount: string;
  network: 'base-sepolia' | 'solana-devnet' | 'mainnet';
  currency: 'USDC' | 'SOL' | 'ETH';
}

export interface PaymentTransaction {
  id: string;
  amount: string;
  currency: string;
  network: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  timestamp: number;
}
