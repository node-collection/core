import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from './engines';

/**
 * Creates a new collection instance from various data sources.
 * * This factory automatically detects the most suitable engine based on the
 * input type, providing a unified API for Eager Sync, Lazy Sync, Eager Async,
 * and Lazy Async operations.
 */

/**
 * Wrap an array of Promises or a Promise of an array into an eager async collection.
 * * * **Behavior:** Evaluates all promises concurrently via `Promise.all`.
 * * **Ideal for:** Batch API calls or DB queries where you need all results
 * before continuing the chain.
 *
 * @template T - The type of elements in the collection.
 * @param items - A Promise of an array or an array of Promises.
 * @returns A new {@link AsyncCollection} instance.
 *
 * @example
 * ```ts
 * const users = await collect([
 * fetch('/api/users/1').then(r => r.json()),
 * fetch('/api/users/2').then(r => r.json()),
 * ]).map(u => u.name).all();
 * ```
 */
export function collect<T>(items: Promise<T[]> | Promise<T>[]): AsyncCollection<T>;

/**
 * Wrap a standard array into an eager synchronous collection.
 * * * **Behavior:** Materializes results into a new array at each operator step.
 * * **Ideal for:** Small to medium datasets where immediate execution and
 * simplicity are preferred over memory optimization.
 *
 * @template T - The type of elements in the array.
 * @param items - A standard T[] array.
 * @returns A new {@link Collection} instance.
 * * @example
 * ```ts
 * const result = collect([1, 2, 3]).map(x => x * 2).all(); // [2, 4, 6]
 * ```
 */
export function collect<T>(items: T[]): Collection<T>;

/**
 * Wrap an async iterable into a lazy asynchronous collection.
 * * * **Behavior:** Items are pulled on-demand. Transformations are deferred
 * via async generators.
 * * **Ideal for:** Processing massive streams (e.g., Large CSVs, DB Cursors)
 * without loading everything into RAM.
 *
 * @template T - The type of elements yielded by the async iterable.
 * @param items - Any `AsyncIterable<T>` (e.g., async generator, readable stream).
 * @returns A new {@link AsyncLazyCollection} instance.
 * * @example
 * ```ts
 * async function* paginate() {
 * yield await fetchPage(1);
 * }
 * * const stream = collect(paginate()).map(p => p.data);
 * ```
 */
export function collect<T>(items: AsyncIterable<T>): AsyncLazyCollection<T>;

/**
 * Wrap any synchronous iterable into a lazy synchronous collection.
 * * * **Behavior:** Uses generator-based pipelines. Transformations only
 * occur when you iterate or call terminal methods (like `.all()`).
 * * **Ideal for:** Large datasets or complex pipelines where intermediate
 * array allocations should be avoided.
 *
 * @template T - The type of elements yielded by the iterable.
 * @param items - Any `Iterable<T>` (e.g., Set, Map, custom Generator).
 * @returns A new {@link LazyCollection} instance.
 */
export function collect<T>(items: Iterable<T>): LazyCollection<T>;

/**
 * Implementation of the collect factory.
 * @internal
 */
export function collect(items: any): any {
  // 1. Handle Empty/Null inputs (Eager Sync default)
  if (items == null) {
    return new Collection([]);
  }

  // 2. Detect Async Iterables (Lazy Async)
  if (typeof items[Symbol.asyncIterator] === 'function') {
    return new AsyncLazyCollection(items);
  }

  // 3. Detect Single Promise (Eager Async)
  if (items instanceof Promise) {
    return new AsyncCollection(items);
  }

  // 4. Detect Arrays & Array of Promises
  if (Array.isArray(items)) {
    // If the first item is a promise, treat the whole array as Eager Async
    if (items.length > 0 && items[0] instanceof Promise) {
      return new AsyncCollection(items);
    }
    return new Collection(items);
  }

  // 5. Detect Sync Iterables (Lazy Sync)
  // Note: We check this after Array because Array is also an Iterable.
  if (typeof items[Symbol.iterator] === 'function') {
    return new LazyCollection(items);
  }

  // 6. Fallback: Wrap single value into a Collection
  return new Collection([items]);
}

/**
 * Type representing the unified collection factory function.
 */
export type CollectionFactory = typeof collect;

/**
 * Bootstrap internal hook to register the factory within the library core.
 * @internal
 */
export const __bootstrap = (register: (fn: typeof collect) => void) => {
  register(collect);
};
