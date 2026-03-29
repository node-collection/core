import { pluginManager } from './manager';
import { NodeCollectionPlugin } from './types';

/**
 * Register one or multiple plugins into the NodeCollections ecosystem.
 *
 * This utility acts as the primary gateway for extending the library.
 * It supports single registration with options, or bulk registration
 * for plugins that don't require additional configuration.
 */

/**
 * Bulk register multiple plugins.
 * @param plugins - An array of plugins to install concurrently.
 * @returns A promise that resolves when all plugins are installed.
 */
export function use(plugins: NodeCollectionPlugin<any>[]): Promise<void[]>;

/**
 * Register a single plugin that doesn't require options.
 * @param plugin - The plugin instance to install.
 */
export function use<TOptions extends void | undefined>(plugin: NodeCollectionPlugin<TOptions>): Promise<void>;

/**
 * Register a single plugin with mandatory or optional configuration.
 * @param plugin - The plugin instance to install.
 * @param options - The configuration object required by the plugin.
 */
export function use<TOptions>(plugin: NodeCollectionPlugin<TOptions>, options: TOptions): Promise<void>;

/**
 * Implementation of the polymorphic use function.
 * @internal
 */
export async function use<T extends NodeCollectionPlugin<any>>(pluginOrPlugins: T | T[], ...args: any[]): Promise<void | void[]> {
  // 1. Handle Bulk Registration
  if (Array.isArray(pluginOrPlugins)) {
    return Promise.all(pluginOrPlugins.map((p) => pluginManager.use(p)));
  }

  // 2. Handle Single Registration
  // We extract the first argument from the tuple as the options object.
  const options = args[0];
  return pluginManager.use(pluginOrPlugins, options);
}
