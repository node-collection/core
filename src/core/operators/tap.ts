import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';
import { register } from '../types';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /**
     * Tap into the collection to perform side effects without modifying the elements.
     * * This method eagerly iterates through the entire collection immediately,
     * executes the callback for each item, and returns the original collection.
     *
     * @param fn - The side-effect callback. Receives the current `item`.
     * @returns The original collection instance.
     *
     * @example
     * ```ts
     * collect([1, 2, 3]).tap(n => console.log(n)); // Logs 1, 2, 3 immediately
     * ```
     */
    tap(fn: (item: T) => void): Collection<T>;
  }

  interface LazyEnumerableMethods<T> {
    /**
     * Tap into the collection lazily.
     * * **Deferred Side Effects:** The callback is NOT executed immediately.
     * It will only run for each item as it is being pulled through the
     * generator pipeline.
     *
     * @param fn - The side-effect logic to run during iteration.
     * @returns A new lazy collection that triggers side effects upon iteration.
     * * @example
     * ```ts
     * const lazy = collect([1, 2]).lazy().tap(n => console.log(n));
     * // Nothing logged yet.
     * lazy.first(); // Logs: 1
     * ```
     */
    tap(fn: (item: T) => void): LazyCollection<T>;
  }

  interface AsyncEnumerableMethods<T> {
    /**
     * Tap into an asynchronous collection to perform side effects.
     * * Waits for the underlying data promise to resolve, then sequentially
     * executes the (potentially async) callback for every item.
     *
     * @param fn - An async side-effect callback. Can return `void` or `Promise<void>`.
     * @returns An async collection resolving back to the original items.
     */
    tap(fn: (item: T) => void | Promise<void>): AsyncCollection<T>;
  }

  interface AsyncLazyEnumerableMethods<T> {
    /**
     * Tap into an asynchronous stream to perform side effects.
     * * Provides a way to "spy" on the stream data. Each callback is awaited
     * sequentially as items flow through the async generator.
     *
     * @param fn - The async side-effect logic for the stream.
     * @returns A lazy async collection that triggers effects as data flows.
     */
    tap(fn: (item: T) => void | Promise<void>): AsyncLazyCollection<T>;
  }
}

// ============================================================================
// LOGIC IMPLEMENTATIONS
// ============================================================================

const eagerSync = <T>(ctx: Collection<T>, fn: (item: T) => void): Collection<T> => {
  ctx.all().forEach(fn);
  return ctx;
};

const lazySync = <T>(ctx: LazyCollection<T>, fn: (item: T) => void): LazyCollection<T> => {
  return new LazyCollection(
    (function* () {
      for (const item of ctx) {
        fn(item);
        yield item;
      }
    })(),
  );
};

const eagerAsync = <T>(ctx: AsyncCollection<T>, fn: (item: T) => void | Promise<void>): AsyncCollection<T> => {
  const tapped = ctx.all().then(async (items) => {
    for (const item of items) {
      await Promise.resolve(fn(item));
    }
    return items;
  });
  return new AsyncCollection(tapped);
};

const lazyAsync = <T>(ctx: AsyncLazyCollection<T>, fn: (item: T) => void | Promise<void>): AsyncLazyCollection<T> => {
  return new AsyncLazyCollection(
    (async function* () {
      for await (const item of ctx) {
        await Promise.resolve(fn(item));
        yield item;
      }
    })(),
  );
};

// ============================================================================
// REGISTRATION
// ============================================================================

defineOperator('tap', [
  register(Collection, eagerSync),
  register(LazyCollection, lazySync),
  register(AsyncCollection, eagerAsync),
  register(AsyncLazyCollection, lazyAsync),
]);
