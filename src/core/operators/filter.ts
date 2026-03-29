import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';
import { register } from '../types';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /**
     * Filter the collection using the given callback.
     * * This method iterates through the entire collection immediately (eagerly)
     * and returns a new {@link Collection} containing only the elements that
     * pass the truth test.
     *
     * @param fn - The truth test callback.
     * - `item`: The current element being tested.
     * @returns A new collection instance with the filtered elements.
     *
     * @example
     * ```ts
     * const evens = collect([1, 2, 3, 4]).filter(n => n % 2 === 0);
     * // Collection { items: [2, 4] }
     * ```
     */
    filter(fn: (item: T) => boolean): Collection<T>;
  }

  interface LazyEnumerableMethods<T> {
    /**
     * Filter the collection lazily as it is being iterated.
     * * The predicate logic is deferred until a terminal method is called.
     * Each item is tested "just-in-time", making it ideal for large datasets
     * where you only need a few matching results.
     *
     * @param fn - The truth test logic.
     * - `item`: The current element provided by the generator.
     * @returns A new lazy collection that yields filtered items.
     *
     * @example
     * ```ts
     * const firstLarge = collect(bigArray).lazy().filter(n => n > 1000).first();
     * // Only iterates until the first match is found.
     * ```
     */
    filter(fn: (item: T) => boolean): LazyCollection<T>;
  }

  interface AsyncEnumerableMethods<T> {
    /**
     * Filter the collection asynchronously and concurrently.
     * * This method triggers all predicate checks simultaneously using `Promise.all`.
     * It is highly efficient for I/O bound filtering where the order of checks
     * doesn't matter, but execution speed does.
     *
     * @param fn - An async callback.
     * - `item`: The current element. Can return `boolean` or `Promise<boolean>`.
     * @returns A promise-based collection resolving to the filtered results.
     *
     * @example
     * ```ts
     * const activeUsers = await collect(ids).async().filter(async (id) => {
     * return await api.checkStatus(id) === 'active';
     * });
     * // All status checks run in parallel.
     * ```
     */
    filter(fn: (item: T) => boolean | Promise<boolean>): AsyncCollection<T>;
  }

  interface AsyncLazyEnumerableMethods<T> {
    /**
     * Filter elements one-by-one via an asynchronous generator.
     * * Provides a memory-efficient pipeline that awaits each truth test
     * before pulling the next item from the source. This prevents overwhelming
     * external systems with too many concurrent requests.
     *
     * @param fn - The async truth test logic.
     * - `item`: The current element from the async source.
     * @returns A lazy async collection yielding filtered results sequentially.
     *
     * @example
     * ```ts
     * const stream = collect(largeStream).asyncLazy().filter(async (row) => {
     * return await db.exists(row.id);
     * });
     * // Checks database one-by-one, keeping DB load and memory flat.
     * ```
     */
    filter(fn: (item: T) => boolean | Promise<boolean>): AsyncLazyCollection<T>;
  }
}

// ============================================================================
// LOGIC IMPLEMENTATIONS
// ============================================================================

const eagerSync = <T>(ctx: Collection<T>, fn: (item: T) => boolean) => {
  return new Collection(ctx.all().filter(fn));
};

const lazySync = <T>(ctx: LazyCollection<T>, fn: (item: T) => boolean) => {
  return new LazyCollection(
    (function* () {
      for (const item of ctx) {
        if (fn(item)) yield item;
      }
    })(),
  );
};

const eagerAsync = <T>(ctx: AsyncCollection<T>, fn: (item: T) => boolean | Promise<boolean>) => {
  const filtered = ctx.all().then(async (items) => {
    // Parallel Execution (Performance Optimization)
    const results = await Promise.all(items.map(async (item) => await fn(item)));
    return items.filter((_, index) => results[index]);
  });
  return new AsyncCollection(filtered);
};

const lazyAsync = <T>(ctx: AsyncLazyCollection<T>, fn: (item: T) => boolean | Promise<boolean>) => {
  return new AsyncLazyCollection(
    (async function* () {
      for await (const item of ctx) {
        if (await fn(item)) yield item;
      }
    })(),
  );
};

// ============================================================================
// REGISTRATION
// ============================================================================

defineOperator('filter', [
  register(Collection, eagerSync),
  register(LazyCollection, lazySync),
  register(AsyncCollection, eagerAsync),
  register(AsyncLazyCollection, lazyAsync),
]);
