import { AsyncEnumerableMethods, AsyncLazyEnumerableMethods, EnumerableMethods, LazyEnumerableMethods } from '../contracts';
import { OperatorDefinitionApi } from '../types';
import { PluginContext } from './context';

/**
 * A union of all available operator names across all four collection dimensions.
 * * This allows plugins to declare their requirements and ensures that
 * dependencies refer to actual existing methods.
 */
export type RegisteredOperators =
  | keyof EnumerableMethods<unknown>
  | keyof LazyEnumerableMethods<unknown>
  | keyof AsyncEnumerableMethods<unknown>
  | keyof AsyncLazyEnumerableMethods<unknown>;

/**
 * Helper to handle polymorphic plugin options.
 * * If `TOptions` is void or undefined, it results in an empty tuple `[]`.
 * Otherwise, it requires a single `options` argument of type `TOptions`.
 */
export type PluginOptionsTuple<TOptions> = TOptions extends void | undefined ? [] : [options: TOptions];

/**
 * The signature for a plugin's installation hook.
 * * Supports both synchronous and asynchronous setup logic.
 */
export type PluginInstallFunction<TOptions> = (app: PluginApp, options: TOptions) => void | Promise<void>;

/**
 * The bridge provided to every plugin during the installation phase.
 */
export interface PluginApp {
  /** Global environment and library context */
  context: PluginContext;
  /** Access to the internal prototype injection engine */
  defineOperator: OperatorDefinitionApi;
}

/**
 * The standard contract for building NodeCollections plugins.
 * * @template TOptions - The type of configuration object accepted by this plugin.
 * * @category Extension
 */
export interface NodeCollectionPlugin<TOptions = any> {
  /** Unique identifier for the plugin (e.g., 'auth-filters') */
  readonly name: string;
  /** * List of operators this plugin expects to be present.
   * Useful for internal validation or documentation.
   */
  readonly dependencies?: RegisteredOperators[];
  /** * The entry point for the plugin logic.
   * This is where you call `app.defineOperator`.
   */
  readonly install: PluginInstallFunction<TOptions>;
}
