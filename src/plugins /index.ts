import { pluginManager } from './manager';
import type { NodeCollectionPlugin } from './types';

export * from './context';
export * from './manager';
export * from './types';

export function use(plugins: NodeCollectionPlugin<any>[]): Promise<void[]>;
export function use<TOptions extends void | undefined>(plugin: NodeCollectionPlugin<TOptions>): Promise<void>;
export function use<TOptions>(plugin: NodeCollectionPlugin<TOptions>, options: TOptions extends void ? never : TOptions): Promise<void>;
export function use<TOptions>(plugin: NodeCollectionPlugin<TOptions | undefined>, options?: TOptions): Promise<void>;
export async function use(pluginOrPlugins: NodeCollectionPlugin<any> | NodeCollectionPlugin<any>[], options?: any): Promise<void | void[]> {
  if (Array.isArray(pluginOrPlugins)) {
    return Promise.all(pluginOrPlugins.map((p) => pluginManager.use(p)));
  }
  return pluginManager.use(pluginOrPlugins, options);
}
