import { AnyCollectionContext, AsyncEnumerableMethods, CollectionHooks, EnumerableMethods, HookSignatures, OperatorDefinitionApi } from '@/core';
import { PluginContext } from './context';

export type RegisteredOperators = keyof EnumerableMethods<unknown> | keyof AsyncEnumerableMethods<unknown>;
export type PluginOptionsTuple<TOptions> = [TOptions] extends [void | undefined]
  ? [options?: undefined]
  : undefined extends TOptions
    ? [options?: TOptions]
    : [options: TOptions];
export type PluginInstallFunction<TOptions> = [TOptions] extends [void | undefined]
  ? (app: PluginApp) => void | Promise<void>
  : undefined extends TOptions
    ? (app: PluginApp, options?: TOptions) => void | Promise<void>
    : (app: PluginApp, options: TOptions) => void | Promise<void>;

export interface PluginApp {
  context: PluginContext;
  on: <K extends keyof CollectionHooks>(eventName: K, fn: NonNullable<CollectionHooks[K]>) => void;
  trigger: <K extends keyof HookSignatures, TContext extends AnyCollectionContext>(
    eventName: K,
    ...args: Parameters<HookSignatures<TContext>[K]>
  ) => void;
  defineOperator: OperatorDefinitionApi;
}

export interface NodeCollectionPlugin<TOptions = void> {
  name: string;
  dependencies?: RegisteredOperators[];
  hooks?: CollectionHooks;
  install: PluginInstallFunction<TOptions>;
}
