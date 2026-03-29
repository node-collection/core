import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';
import { register } from '../types';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /**
     * Transform each element in the collection using a callback function.
     * * This method iterates through the entire collection immediately (eagerly)
     * and returns a new {@link Collection} containing the results.
     *
     * @template U - The type of the elements in the resulting collection.
     * @param fn - The transformation callback.
     * - `item`: The current element being processed.
     * @returns A new collection instance with the transformed elements.
     *
     * @example
     * ```ts
     * const doubled = collect([1, 2, 3]).map(n => n * 2);
     * // Collection { items: [2, 4, 6] }
     * ```
     */
    map<U>(fn: (item: T) => U): Collection<U>;
  }

  interface LazyEnumerableMethods<T> {
    /**
     * Transform each element lazily as the collection is being iterated.
     * * Unlike eager map, this uses a generator pipeline. The transformation
     * is deferred until a terminal method (like `.toArray()`) is called.
     *
     * @template U - The type of the elements in the resulting lazy collection.
     * @param fn - The transformation logic applied to each item.
     * - `item`: The current element provided by the generator.
     * @returns A new lazy collection that yields transformed items.
     *
     * @example
     * ```ts
     * const lazy = collect([1, 2, 3]).lazy().map(n => n * 10);
     * // No transformation happens yet.
     * console.log(lazy.first()); // 10 (Only the first item is processed)
     * ```
     */
    map<U>(fn: (item: T) => U): LazyCollection<U>;
  }

  interface AsyncEnumerableMethods<T> {
    /**
     * Transform each element asynchronously and concurrently.
     * * Triggers all transformation promises simultaneously using `Promise.all`.
     * Best for high-throughput I/O where execution speed is critical.
     *
     * @template U - The type of the elements after the promise resolves.
     * @param fn - An async callback.
     * - `item`: The current element. Can return `U` or `Promise<U>`.
     * @returns A promise-based collection resolving once all transformations finish.
     *
     * @example
     * ```ts
     * const users = await collect([1, 2, 3])
     * .async()
     * .map(async (id) => await fetchUser(id));
     * // All 3 fetches start at the same time (concurrently).
     * ```
     */
    map<U>(fn: (item: T) => U | Promise<U>): AsyncCollection<U>;
  }

  interface AsyncLazyEnumerableMethods<T> {
    /**
     * Transform elements one-by-one via an asynchronous generator.
     * * This provides a memory-efficient pipeline for async data. It awaits the
     * transformation of the current item before pulling the next one.
     *
     * @template U - The resulting type yielded by the async generator.
     * @param fn - The async transformation logic.
     * - `item`: The current element from the async source.
     * @returns A lazy async collection yielding results sequentially.
     *
     * @example
     * ```ts
     * const stream = collect(largeFile)
     * .asyncLazy()
     * .map(async (row) => await processRow(row));
     * * for await (const result of stream) {
     * // Processed one-by-one, keeping memory usage flat.
     * }
     * ```
     */
    map<U>(fn: (item: T) => U | Promise<U>): AsyncLazyCollection<U>;
  }
}

const eagerSync = <T, U>(ctx: Collection<T>, fn: (item: T) => U) => {
  return new Collection(ctx.all().map(fn));
};

const lazySync = <T, U>(ctx: LazyCollection<T>, fn: (item: T) => U) => {
  return new LazyCollection(
    (function* () {
      for (const item of ctx) yield fn(item);
    })(),
  );
};

const eagerAsync = <T, U>(ctx: AsyncCollection<T>, fn: (item: T) => U | Promise<U>) => {
  return new AsyncCollection(ctx.all().then((items) => Promise.all(items.map(async (item) => await fn(item)))));
};

const lazyAsync = <T, U>(ctx: AsyncLazyCollection<T>, fn: (item: T) => U | Promise<U>) => {
  return new AsyncLazyCollection(
    (async function* () {
      for await (const item of ctx) yield await fn(item);
    })(),
  );
};

defineOperator('map', [
  register(Collection, eagerSync),
  register(LazyCollection, lazySync),
  register(AsyncCollection, eagerAsync),
  register(AsyncLazyCollection, lazyAsync),
]);
