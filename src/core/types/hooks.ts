import { AsyncEnumerable, Enumerable } from '@/core/contracts/enumerable';

export type AnyCollectionContext = Enumerable<unknown> | AsyncEnumerable<unknown> | unknown;

export interface BuiltinHookSignatures<TContext = AnyCollectionContext> {
  init: (ctx: TContext) => void;
  beforeIterate: (ctx: TContext) => void;
  afterIterate: (ctx: TContext, stats: { count: number }) => void;
  error: (error: unknown, ctx: TContext) => void;
}

export interface CustomHookSignatures<TContext = AnyCollectionContext> {}

export type HookSignatures<TContext = AnyCollectionContext> = BuiltinHookSignatures<TContext> & CustomHookSignatures<TContext>;

export type CollectionHooks<TContext = AnyCollectionContext> = {
  [K in keyof HookSignatures<TContext> as `on${Capitalize<string & K>}`]?: HookSignatures<TContext>[K];
};

export class HookManager {
  private listeners: Partial<Record<keyof CollectionHooks, Function[]>> = {};
  register<K extends keyof CollectionHooks>(hookName: K, fn: NonNullable<CollectionHooks[K]>) {
    if (!this.listeners[hookName]) {
      this.listeners[hookName] = [];
    }
    this.listeners[hookName]!.push(fn as Function);
  }

  trigger<K extends keyof HookSignatures, TContext extends AnyCollectionContext>(event: K, ...args: Parameters<HookSignatures<TContext>[K]>) {
    const hookName = `on${String(event).charAt(0).toUpperCase() + String(event).slice(1)}` as keyof CollectionHooks;
    const hooks = this.listeners[hookName];

    if (hooks) {
      for (const fn of hooks) {
        fn(...args);
      }
    }
  }
}

export const coreHooks = new HookManager();
