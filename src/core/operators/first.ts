import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';
import { register } from '../types';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /**
     * Get the first element in the collection, or the first element that
     * passes a given truth test.
     * * This method will return `null` if the collection is empty or if
     * no element passes the test.
     *
     * @param fn - An optional truth test callback.
     * - `item`: The current element being tested.
     * @returns The first matching element, or `null` if none found.
     *
     * @example
     * ```ts
     * collect([1, 2, 3]).first(); // 1
     * collect([1, 2, 3]).first(n => n > 1); // 2
     * ```
     */
    first(fn?: (item: T) => boolean): T | null;
  }

  interface LazyEnumerableMethods<T> {
    /**
     * Get the first element lazily.
     * * **Short-circuiting:** This is highly efficient as it stops the
     * generator immediately once a match is found, avoiding unnecessary
     * processing of the remaining items.
     *
     * @param fn - An optional truth test logic.
     * @returns The first matching element, or `null`.
     */
    first(fn?: (item: T) => boolean): T | null;
  }

  interface AsyncEnumerableMethods<T> {
    /**
     * Get the first element asynchronously.
     * * If a predicate is provided, it will await each truth test sequentially
     * to ensure the correct "first" occurrence is returned according to
     * the collection's order.
     *
     * @param fn - An optional async truth test.
     * - `item`: The current element. Can return `boolean` or `Promise<boolean>`.
     * @returns A promise resolving to the first matching element, or `null`.
     */
    first(fn?: (item: T) => boolean | Promise<boolean>): Promise<T | null>;
  }

  interface AsyncLazyEnumerableMethods<T> {
    /**
     * Get the first element from an asynchronous stream.
     * * **Memory Efficient:** Pulls items from the async source one-by-one
     * and stops the stream as soon as the criteria is met. Ideal for
     * finding a single record in massive remote datasets or large files.
     *
     * @param fn - An optional async truth test logic.
     * @returns A promise resolving to the first match from the stream.
     */
    first(fn?: (item: T) => boolean | Promise<boolean>): Promise<T | null>;
  }
}

// ============================================================================
// LOGIC IMPLEMENTATIONS
// ============================================================================

const eagerSync = <T>(ctx: Collection<T>, fn?: (item: T) => boolean): T | null => {
  const items = ctx.all();
  return fn ? (items.find(fn) ?? null) : (items[0] ?? null);
};

const lazySync = <T>(ctx: LazyCollection<T>, fn?: (item: T) => boolean): T | null => {
  for (const item of ctx) {
    if (!fn || fn(item)) return item;
  }
  return null;
};

const eagerAsync = async <T>(ctx: AsyncCollection<T>, fn?: (item: T) => boolean | Promise<boolean>): Promise<T | null> => {
  const items = await ctx.all();
  if (!fn) return items[0] ?? null;

  for (const item of items) {
    if (await fn(item)) return item;
  }
  return null;
};

const lazyAsync = async <T>(ctx: AsyncLazyCollection<T>, fn?: (item: T) => boolean | Promise<boolean>): Promise<T | null> => {
  for await (const item of ctx) {
    if (!fn || (await fn(item))) return item;
  }
  return null;
};

// ============================================================================
// REGISTRATION
// ============================================================================

defineOperator('first', [
  register(Collection, eagerSync),
  register(LazyCollection, lazySync),
  register(AsyncCollection, eagerAsync),
  register(AsyncLazyCollection, lazyAsync),
]);
