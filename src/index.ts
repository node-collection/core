import './operators/tap';
import './operators/map';
import './operators/pluck';
import './operators/where';
import './operators/take';
import './operators/first';

import { AsyncCollection } from './core/engines/async/async-collection';
import { AsyncLazyCollection } from './core/engines/async/async-lazy-collection';
import { Collection } from './core/engines/sync/collection';
import { LazyCollection } from './core/engines/sync/lazy-collection';

export * from './core';
export * from './operators';

/**
 * Wrap an array of Promises into an eager async collection.
 * Evaluates all promises concurrently via Promise.all,
 * resolving the entire set before any operator runs.
 *
 * @param   items  An array of `Promise<T>` to wrap.
 * @returns        An {@link AsyncCollection} instance.
 *
 * @example
 * ```ts
 * const users = await collect([
 *   fetch('/api/users/1').then(r => r.json()),
 *   fetch('/api/users/2').then(r => r.json()),
 * ]).map(u => u.name).all();
 * ```
 *
 * @category  Factory
 */
export function collect<T>(items: Promise<T>[]): AsyncCollection<T>;

/**
 * Wrap a standard array into an eager sync collection.
 * All operator chains are evaluated immediately,
 * materializing results into a new array each step.
 *
 * @param   items  A standard `T[]` array to wrap.
 * @returns        A {@link Collection} instance.
 *
 * @example
 * ```ts
 * const result = collect([1, 2, 3])
 *   .map(x => x * 2)
 *   .all(); // [2, 4, 6]
 * ```
 *
 * @category  Factory
 */
export function collect<T>(items: T[]): Collection<T>;

/**
 * Wrap an async iterable into a lazy async collection.
 * Items are pulled on-demand — nothing runs until
 * you iterate with `for await...of` or call `.all()`.
 *
 * @param   items  Any `AsyncIterable<T>` (e.g. async generator, stream).
 * @returns        An {@link AsyncLazyCollection} instance.
 *
 * @example
 * ```ts
 * async function* paginate() {
 *   for (let page = 1; page <= 10; page++)
 *     yield await fetchPage(page);
 * }
 *
 * for await (const data of collect(paginate()).map(p => p.items)) { ... }
 * ```
 *
 * @category  Factory
 */
export function collect<T>(items: AsyncIterable<T>): AsyncLazyCollection<T>;

/**
 * Wrap any sync iterable into a lazy sync collection.
 * Transformations are deferred via generators, avoiding
 * intermediate array allocation on every operator step.
 *
 * @param   items  Any `Iterable<T>` (e.g. `Set`, `Map`, generator).
 * @returns        A {@link LazyCollection} instance.
 *
 * @example
 * ```ts
 * function* range(n: number) {
 *   for (let i = 0; i < n; i++) yield i;
 * }
 *
 * const result = collect(range(1_000_000)).map(x => x * 2).all();
 * ```
 *
 * @category  Factory
 */
export function collect<T>(items: Iterable<T>): LazyCollection<T>;

/**
 * @internal
 */
export function collect(items: any): any {
  // A. Async Iterable — checked before Array since AsyncGenerator is not an Array
  if (items != null && typeof items[Symbol.asyncIterator] === 'function') {
    return new AsyncLazyCollection(items);
  }

  // B. Array — checked before Iterable since Array IS an Iterable
  if (Array.isArray(items)) {
    if (items.length > 0 && items[0] instanceof Promise) {
      return new AsyncCollection(items);
    }
    return new Collection(items);
  }

  // C. Sync Iterable — Set, Map, custom generators
  if (items != null && typeof items[Symbol.iterator] === 'function') {
    return new LazyCollection(items);
  }

  // D. Fallback — wrap single value or return an empty Collection
  return new Collection(items != null ? [items] : []);
}
