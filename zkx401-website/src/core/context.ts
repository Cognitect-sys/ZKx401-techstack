// ZKx401 Context System - Composable Architecture
import { z } from 'zod';
import type { ContextBase, ContextState, Action, ContextComposition, WorkingMemory } from './types.js';

export class Context<TMemory extends Record<string, any> = Record<string, any>, TArgs = Record<string, any>> {
  private _type: string;
  private _schema?: z.ZodType<TArgs>;
  private _create: () => TMemory;
  private _actions: Array<Action> = [];
  private _render?: (state: ContextState<TMemory, TArgs>) => string;
  private _composition: ContextComposition[] = [];

  constructor(params: {
    type: string;
    schema?: z.ZodType<TArgs>;
    create: () => TMemory;
    render?: (state: ContextState<TMemory, TArgs>) => string;
  }) {
    this._type = params.type;
    this._schema = params.schema;
    this._create = params.create;
    this._render = params.render;
  }

  // Add actions to context
  setActions(actions: Array<Action>): this {
    this._actions = [...this._actions, ...actions];
    return this;
  }

  // Add instruction template
  instructions(instructions: string | ((state: ContextState<TMemory, TArgs>) => string)): this {
    this._render = instructions;
    return this;
  }

  // Composable context composition - The magic of Daydreams!
  use(composer: (state: ContextState<TMemory, TArgs>) => ContextComposition[]): this {
    this._composition = composer;
    return this;
  }

  // Create context instance
  create(args: TArgs, workingMemory: WorkingMemory): ContextBase<TMemory, TArgs> & { actions: Array<Action> } {
    return {
      type: this._type,
      schema: this._schema,
      memory: this._create(),
      args,
      instructions: this._render,
      actions: this._actions,
      // Add working memory for current session
      workingMemory,
    };
  }

  // Get composition rules
  getComposition(): ContextComposition[] {
    return this._composition;
  }

  // Render instructions
  renderInstructions(state: ContextState<TMemory, TArgs>): string | undefined {
    return this._render ? this._render(state) : undefined;
  }
}

// Context factory function - Inspired by Daydreams API
export function context<TMemory extends Record<string, any> = Record<string, any>, TArgs = Record<string, any>>(params: {
  type: string;
  schema?: z.ZodType<TArgs>;
  create: () => TMemory;
  render?: (state: ContextState<TMemory, TArgs>) => string;
}): Context<TMemory, TArgs> {
  return new Context(params);
}

// Action factory function
export function action<TCtx extends ContextBase = ContextBase, TInput = any, TOutput = any>(params: {
  name: string;
  description?: string;
  schema?: z.ZodType<TInput>;
  handler: (input: TInput, ctx: TCtx) => Promise<TOutput>;
}): Action<TCtx, TInput, TOutput> {
  return params;
}

// Context composition engine
export class ContextComposer {
  private contexts: Map<string, ContextBase> = new Map();
  private compositionRules: Map<string, ContextComposition[]> = new Map();

  addContext(name: string, context: ContextBase, composition?: ContextComposition[]): void {
    this.contexts.set(name, context);
    if (composition) {
      this.compositionRules.set(name, composition);
    }
  }

  // Compose contexts based on rules
  composeContexts(mainContext: string, state: ContextState<any, any>): ContextBase[] {
    const composed: ContextBase[] = [];
    
    if (this.contexts.has(mainContext)) {
      const mainCtx = this.contexts.get(mainContext)!;
      composed.push(mainCtx);

      // Add composed contexts
      const rules = this.compositionRules.get(mainContext);
      if (rules) {
        for (const rule of rules) {
          if (!rule.condition || rule.condition(state)) {
            composed.push(rule.context);
          }
        }
      }
    }

    return composed;
  }

  getAllContexts(): string[] {
    return Array.from(this.contexts.keys());
  }
}
