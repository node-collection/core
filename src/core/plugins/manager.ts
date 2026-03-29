import { defineOperator } from '../define';
import { globalContext } from './context';
import { NodeCollectionPlugin, PluginApp, PluginOptionsTuple } from './types';

/**
 * Manages the lifecycle and registration of external plugins.
 * * This manager ensures that each plugin is only installed once and
 * provides a unified 'PluginApp' bridge to the library's core.
 * * @category Core
 */
export class PluginManager {
  /**
   * Internal set of unique plugin names that have already been initialized.
   */
  private readonly installedPlugins = new Set<string>();

  /**
   * Registers and initializes a new plugin.
   * * This method is asynchronous to support plugins that require
   * IO-bound setup (e.g., fetching configuration or connecting to remote logs)
   * before injecting their operators.
   * * @template TOptions - The specific options type required by the plugin.
   * @param plugin - The plugin definition object.
   * @param args - Arguments to be passed to the plugin's install method.
   * @returns A Promise that resolves once the plugin is fully operational.
   * * @example
   * ```ts
   * await pluginManager.use(MyAuthPlugin, { apiKey: '123' });
   * ```
   */
  async use<TOptions>(plugin: NodeCollectionPlugin<TOptions>, ...args: PluginOptionsTuple<TOptions>): Promise<void> {
    // 1. Prevent duplicate registration based on unique plugin name
    if (this.installedPlugins.has(plugin.name)) {
      return;
    }

    const options = args[0] as TOptions | undefined;

    /**
     * The bridge object provided to the plugin.
     * Maps global context and the defineOperator utility.
     */
    const app: PluginApp = {
      context: globalContext,
      /**
       * Proxy to the core defineOperator.
       * Uses rest parameters to ensure all overloads of defineOperator work.
       */
      defineOperator: (...params: any[]) => (defineOperator as any)(...params),
    };

    try {
      // 2. Execute the installation hook
      if (options !== undefined) {
        await plugin.install(app, options);
      } else {
        // Handle plugins that don't require options
        await (plugin.install as any)(app);
      }

      // 3. Mark as successfully installed
      this.installedPlugins.add(plugin.name);
    } catch (error) {
      console.error(`[NodeCollections] Error installing plugin "${plugin.name}":`, error);
      throw error; // Re-throw to let the consumer know the initialization failed
    }
  }

  /**
   * Checks if a specific plugin has already been loaded.
   * @param name - The unique name of the plugin.
   */
  has(name: string): boolean {
    return this.installedPlugins.has(name);
  }
}

/**
 * Global singleton instance of the PluginManager.
 */
export const pluginManager = new PluginManager();
