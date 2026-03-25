import type { NodeCollectionPlugin, PluginApp, PluginOptionsTuple } from './types';
import { globalContext } from './context';
import { defineOperator } from '../core/define';
import { AnyCollectionContext, coreHooks, HookSignatures } from '@/core';

export class PluginManager {
  private installedPlugins = new Set<string>();
  async use<TOptions>(plugin: NodeCollectionPlugin<TOptions>, ...args: PluginOptionsTuple<TOptions>): Promise<void> {
    if (this.installedPlugins.has(plugin.name)) return;

    const options = args[0] as TOptions | undefined;

    const app: PluginApp = {
      context: globalContext,
      defineOperator: defineOperator.bind(null),
      on(eventName, fn) {
        coreHooks.register(eventName, fn);
      },
      trigger: function <K extends keyof HookSignatures, TContext extends AnyCollectionContext>(
        eventName: K,
        ...args: Parameters<HookSignatures<TContext>[K]>
      ): void {
        coreHooks.trigger<K, TContext>(eventName, ...args);
      },
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
