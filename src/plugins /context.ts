export interface PluginContext {
  env?: string;
}

export const globalContext: PluginContext = {
  env: process.env.NODE_ENV || 'development',
};
