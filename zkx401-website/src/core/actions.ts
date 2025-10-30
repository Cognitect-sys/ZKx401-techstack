/**
 * ZKx401 Action System
 * Type-safe action execution with schema validation
 */

import { z } from 'zod';

// Simplified types for actions
export interface ContextAction<T = any> {
  (payload: T, context: any): Promise<any>;
}

export interface ContextConfig {
  sessionId: string;
  timestamp: Date;
  [key: string]: any;
}

// Base context interface
export interface BaseContext {
  id: string;
  name: string;
  description: string;
  initialize(): Promise<void>;
  cleanup(): Promise<void>;
  use<T extends BaseContext>(context: T): any;
}

export class ActionExecutor {
  private actions: Map<string, ContextAction> = new Map();
  private schemas: Map<string, z.ZodSchema> = new Map();

  /**
   * Register an action with its validation schema
   */
  registerAction<T>(
    name: string,
    action: ContextAction<T>,
    schema?: z.ZodSchema<T>
  ): void {
    this.actions.set(name, action);
    if (schema) {
      this.schemas.set(name, schema);
    }
  }

  /**
   * Execute an action with validation
   */
  async execute<T>(
    name: string,
    payload: T,
    context: ContextConfig
  ): Promise<any> {
    const action = this.actions.get(name);
    if (!action) {
      throw new Error(`Action '${name}' not found`);
    }

    const schema = this.schemas.get(name);
    if (schema) {
      try {
        schema.parse(payload);
      } catch (error) {
        throw new Error(`Action payload validation failed: ${error}`);
      }
    }

    return await action(payload, context);
  }

  /**
   * Check if an action exists
   */
  hasAction(name: string): boolean {
    return this.actions.has(name);
  }

  /**
   * List all available actions
   */
  listActions(): string[] {
    return Array.from(this.actions.keys());
  }
}

/**
 * Built-in action schemas
 */
export const ActionSchemas = {
  // Privacy Actions
  generateZKProof: z.object({
    data: z.string(),
    circuit: z.string(),
    privateInputs: z.record(z.any())
  }),

  verifyProof: z.object({
    proof: z.string(),
    publicInputs: z.array(z.any()),
    verificationKey: z.string()
  }),

  // Payment Actions
  processPayment: z.object({
    amount: z.number().positive(),
    currency: z.string(),
    recipient: z.string(),
    metadata: z.record(z.any()).optional()
  }),

  estimateFees: z.object({
    amount: z.number().positive(),
    tokenAddress: z.string(),
    priority: z.enum(['low', 'medium', 'high'])
  }),

  // Blockchain Actions
  deployContract: z.object({
    code: z.string(),
    constructorArgs: z.array(z.any()),
    networkId: z.string()
  }),

  executeTransaction: z.object({
    to: z.string(),
    data: z.string(),
    value: z.string().optional(),
    gasLimit: z.string().optional()
  }),

  // Agent Actions
  deployAgent: z.object({
    config: z.object({
      name: z.string(),
      capabilities: z.array(z.string()),
      privacy: z.boolean().default(true),
      paymentRequired: z.boolean().default(false)
    }),
    deploymentOptions: z.record(z.any()).optional()
  }),

  agentCommand: z.object({
    agentId: z.string(),
    command: z.string(),
    parameters: z.record(z.any()).optional(),
    priority: z.enum(['low', 'normal', 'high']).default('normal')
  })
};

/**
 * Global action executor instance
 */
export const actionExecutor = new ActionExecutor();

// Export default instance
export default actionExecutor;