import { Enumerable, LazyEnumerableMethods } from '@/core/contracts/enumerable';

export interface LazyCollection<T> extends Enumerable<T>, LazyEnumerableMethods<T> {}

/**
 * A lazy, synchronous collection backed by any `Iterable<T>`.
 * Operator chains are deferred via generators — no work
 * is done until you iterate or call {@link all}.
 *
 * @typeParam T - The type of elements yielded by the source.
 *
 * @example
 * ```ts
 * function* range(n: number) {
 *   for (let i = 0; i < n; i++) yield i;
 * }
 *
 * new LazyCollection(range(1_000_000))
 *   .map(x => x * 2)
 *   .all();
 * ```
 *
 * @category  Engine
 */
export class LazyCollection<T> {
  /**
   * Create a new LazyCollection wrapping the given iterable.
   * The source is not consumed on construction —
   * evaluation defers until iteration begins.
   *
   * @param   source  Any `Iterable<T>` to wrap.
   */
  constructor(protected source: Iterable<T>) {}

  /**
   * Iterate over all elements from the source iterable.
   * Each call creates a fresh pass — note that
   * generators can only be consumed once.
   *
   * @example
   * ```ts
   * for (const item of new LazyCollection(new Set([1, 2, 3]))) {
   *   console.log(item);
   * }
   * ```
   */
  *[Symbol.iterator](): Generator<T, void, unknown> {
    let count = 0;
    try {
      // Kita buka yield* jadi loop manual untuk tracking count
      for (const item of this.source) {
        yield item;
        count++;
      }
    } catch (err) {
      throw err;
    } finally {
    }
  }

  /**
   * Eagerly materialize all deferred elements into an array.
   * Triggers full evaluation of the generator chain —
   * call only when the full result set is needed.
   *
   * @returns  A new `T[]` containing all yielded elements.
   *
   * @example
   * ```ts
   * function* nums() { yield 1; yield 2; yield 3; }
   *
   * new LazyCollection(nums()).all(); // [1, 2, 3]
   * ```
   */
  all(): T[] {
    return Array.from(this.source);
  }
}
