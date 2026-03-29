import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';
import { register } from '../types';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /**
     * Create a new collection with a specified number of items from the start.
     * * This method eagerly slices the underlying array and returns a new
     * {@link Collection} containing only the first `limit` elements.
     *
     * @param limit - The number of items to take. If negative, 0 is used.
     * @returns A new collection with the limited subset of items.
     *
     * @example
     * ```ts
     * collect([1, 2, 3, 4, 5]).take(3); // [1, 2, 3]
     * ```
     */
    take(limit: number): Collection<T>;
  }

  interface LazyEnumerableMethods<T> {
    /**
     * Take a specified number of items lazily.
     * * **Short-circuiting:** This is highly efficient because the generator
     * stops iterating immediately once the limit is reached. It avoids
     * processing any subsequent items in the pipeline.
     *
     * @param limit - The maximum number of items to yield.
     * @returns A new lazy collection that stops after `limit` items.
     */
    take(limit: number): LazyCollection<T>;
  }

  interface AsyncEnumerableMethods<T> {
    /**
     * Take a specified number of items from an asynchronous collection.
     * * This method waits for the underlying data promise to resolve,
     * then eagerly slices the result to the requested limit.
     *
     * @param limit - The number of items to take from the resolved array.
     * @returns An async collection resolving to the limited subset.
     */
    take(limit: number): AsyncCollection<T>;
  }

  interface AsyncLazyEnumerableMethods<T> {
    /**
     * Take a specified number of items from an asynchronous stream.
     * * **Backpressure Friendly:** The async generator stops pulling data
     * from the source (e.g., API, DB Cursor, or File Stream) as soon as
     * the limit is met, saving bandwidth and memory.
     *
     * @param limit - The maximum number of items to pull from the stream.
     * @returns A lazy async collection that terminates after `limit` items.
     */
    take(limit: number): AsyncLazyCollection<T>;
  }
}

// ============================================================================
// LOGIC IMPLEMENTATIONS
// ============================================================================

const eagerSync = <T>(ctx: Collection<T>, limit: number): Collection<T> => {
  const safeLimit = Math.max(0, limit);
  return new Collection(ctx.all().slice(0, safeLimit));
};

const lazySync = <T>(ctx: LazyCollection<T>, limit: number): LazyCollection<T> => {
  return new LazyCollection(
    (function* () {
      if (limit <= 0) return;
      let count = 0;
      for (const item of ctx) {
        yield item;
        if (++count >= limit) break;
      }
    })(),
  );
};

const eagerAsync = <T>(ctx: AsyncCollection<T>, limit: number): AsyncCollection<T> => {
  const sliced = ctx.all().then((items) => {
    const safeLimit = Math.max(0, limit);
    return items.slice(0, safeLimit);
  });
  return new AsyncCollection(sliced);
};

const lazyAsync = <T>(ctx: AsyncLazyCollection<T>, limit: number): AsyncLazyCollection<T> => {
  return new AsyncLazyCollection(
    (async function* () {
      if (limit <= 0) return;
      let count = 0;
      for await (const item of ctx) {
        yield item;
        if (++count >= limit) break;
      }
    })(),
  );
};

// ============================================================================
// REGISTRATION
// ============================================================================

defineOperator('take', [
  register(Collection, eagerSync),
  register(LazyCollection, lazySync),
  register(AsyncCollection, eagerAsync),
  register(AsyncLazyCollection, lazyAsync),
]);
