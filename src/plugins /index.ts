import { pluginManager } from './manager';
import type { NodeCollectionPlugin, PluginOptionsTuple } from './types';

export * from './context';
export * from './manager';
export * from './types';

export function use(plugins: NodeCollectionPlugin<any>[]): Promise<void[]>;
export function use<TOptions extends void | undefined>(plugin: NodeCollectionPlugin<TOptions>): Promise<void>;
export function use<TOptions>(plugin: NodeCollectionPlugin<TOptions>, options: TOptions extends void ? never : TOptions): Promise<void>;
export async function use<T extends NodeCollectionPlugin<any>>(
  pluginOrPlugins: T | T[],
  ...args: T extends NodeCollectionPlugin<infer TOptions> ? PluginOptionsTuple<TOptions> : []
): Promise<void | void[]> {
  // 1. Handle Array (Batch Install)
  if (Array.isArray(pluginOrPlugins)) {
    return Promise.all(pluginOrPlugins.map((p) => pluginManager.use(p)));
  }

  // 2. Handle Single Plugin dengan Options
  const options = args[0];
  return pluginManager.use(pluginOrPlugins, options);
}
