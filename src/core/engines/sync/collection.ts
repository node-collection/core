import { Enumerable, EnumerableMethods } from '@/core/contracts/enumerable';

export interface Collection<T> extends Enumerable<T>, EnumerableMethods<T> {}

/**
 * An eager, synchronous collection backed by a plain array.
 * All operator chains are evaluated immediately into
 * a new array on each step.
 *
 * @typeParam T - The type of elements in this collection.
 *
 * @example
 * ```ts
 * const result = new Collection([1, 2, 3])
 *   .map(x => x * 2)
 *   .all(); // [2, 4, 6]
 * ```
 *
 * @category  Engine
 */
export class Collection<T> {
  /**
   * Create a new Collection wrapping the given array.
   * The source is stored as-is — call {@link all}
   * to retrieve a safe shallow copy.
   *
   * @param   items  The source array to wrap.
   */
  constructor(protected items: T[]) {}

  /**
   * Iterate over all elements in insertion order.
   * Supports `for...of`, spread, and
   * destructuring natively.
   *
   * @example
   * ```ts
   * for (const item of new Collection([1, 2, 3])) {
   *   console.log(item);
   * }
   * ```
   */
  *[Symbol.iterator](): Generator<T, void, unknown> {
    yield* this.items;
  }

  /**
   * Materialize all elements into a new array.
   * Returns a shallow copy — mutations to the result
   * do not affect this collection.
   *
   * @returns  A new `T[]` containing all elements.
   *
   * @example
   * ```ts
   * new Collection([1, 2, 3]).all(); // [1, 2, 3]
   * ```
   */
  all(): T[] {
    return [...this.items];
  }
}
