/**
 * NodeCollections - A Laravel-inspired, type-safe collection library
 * for Synchronous, Lazy, and Asynchronous data streams.
 */
import { CollectionFactory, __bootstrap } from './core/collect';
// Import all side-effects (operator registrations)
// This ensures defineOperator() is called for each built-in operator.
import './core/operators';

/**
 * Internal storage for the bootstrapped factory.
 * @internal
 */
let collectionApi: CollectionFactory;

/**
 * Initialize the collection factory through the bootstrap hook.
 * This ensures that the 'collect' function is only available
 * after the internal engines and operators are ready.
 */
__bootstrap((fn) => {
  collectionApi = fn;
});

/**
 * The primary entry point for creating collections.
 * * This function automatically detects your data source (Array, Promise,
 * Iterable, or AsyncIterable) and wraps it in the most efficient
 * collection engine.
 * * @example
 * ```ts
 * import { collect } from 'node-collections';
 * * // Eager Sync
 * const list = collect([1, 2, 3]).map(x => x * 2).all();
 * * // Lazy Async (Streams)
 * const stream = collect(asyncGenerator).filter(async (u) => u.isActive);
 * ```
 * * @category Factory
 */
export const collect: CollectionFactory = collectionApi!;

/**
 * Export plugin system and registration contracts.
 * Allows third-party developers to extend the library with new operators.
 */
export * from './core/plugins';

/**
 * Export core contracts and engine types for advanced usage.
 */
export * from './core/contracts';
export * from './core/types';
