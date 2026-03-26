import type { NodeCollectionPlugin, PluginApp, PluginOptionsTuple } from './types';
import { globalContext } from './context';
import { defineOperator } from '../core/define';

export class PluginManager {
  private installedPlugins = new Set<string>();
  async use<TOptions>(plugin: NodeCollectionPlugin<TOptions>, ...args: PluginOptionsTuple<TOptions>): Promise<void> {
    if (this.installedPlugins.has(plugin.name)) return;

    const options = args[0] as TOptions | undefined;

    const app: PluginApp = {
      context: globalContext,
      defineOperator: (...args: any[]) => (defineOperator as any)(...args),
    };

    if (options !== undefined) {
      await plugin.install(app, options as any);
    } else {
      await (plugin.install as any)(app);
    }

    this.installedPlugins.add(plugin.name);
  }
}

export const pluginManager = new PluginManager();
