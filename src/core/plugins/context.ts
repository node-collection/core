/**
 * Global context shared across all registered plugins.
 * Useful for environment-specific logic (e.g., debugging).
 */
export interface PluginContext {
  /** Current environment name (e.g., 'development', 'production', 'test') */
  env?: string;
  /** Optional version of the host library */
  version?: string;
}

/**
 * Initialized global context.
 * Falls back to 'development' if NODE_ENV is not set.
 */
export const globalContext: PluginContext = {
  env: typeof process !== 'undefined' ? process.env.NODE_ENV : 'development',
  version: '1.0.0', // Sesuaikan dengan version library kamu
};
