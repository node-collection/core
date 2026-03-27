import { AsyncEnumerableMethods, EnumerableMethods } from '../contracts';
import { OperatorDefinitionApi } from '../types';
import { PluginContext } from './context';

export type RegisteredOperators = keyof EnumerableMethods<unknown> | keyof AsyncEnumerableMethods<unknown>;
export type PluginOptionsTuple<TOptions> = TOptions extends void | undefined ? [] : [options: TOptions];
export type PluginInstallFunction<TOptions> = (app: PluginApp, options: TOptions) => void | Promise<void>;

export interface PluginApp {
  context: PluginContext;
  defineOperator: OperatorDefinitionApi;
}

export interface NodeCollectionPlugin<TOptions = any> {
  name: string;
  dependencies?: RegisteredOperators[];
  install: PluginInstallFunction<TOptions>;
}
