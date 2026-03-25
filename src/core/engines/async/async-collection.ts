import { AsyncEnumerable, AsyncEnumerableMethods } from '@/core/contracts/enumerable';

export interface AsyncCollection<T> extends AsyncEnumerable<T>, AsyncEnumerableMethods<T> {}

/**
 * An eager, async collection backed by an array of Promises.
 * All Promises are resolved concurrently via `Promise.all`,
 * preserving input order regardless of resolution time.
 *
 * Operator chains return a new `AsyncCollection` synchronously
 * to keep the API fluent — only {@link all} triggers
 * actual Promise resolution.
 *
 * @typeParam T - The resolved value type of each Promise.
 *
 * @example
 * ```ts
 * const names = await new AsyncCollection([
 *   fetch('/api/users/1').then(r => r.json()),
 *   fetch('/api/users/2').then(r => r.json()),
 * ])
 *   .map(u => u.name)
 *   .all(); // ['Alice', 'Bob']
 * ```
 *
 * @category  Engine
 */
export class AsyncCollection<T> {
  /**
   * Create a new AsyncCollection from an array of Promises
   * or a pre-resolved `Promise<T[]>` for efficient chaining.
   * Passing `Promise<T[]>` skips unnecessary `Promise.all`
   * wrapping inside operator chains like `map`.
   *
   * @param   items  An array of `Promise<T>` or a single `Promise<T[]>`.
   */
  constructor(protected items: Promise<T>[] | Promise<T[]>) {}

  /**
   * Async-iterate over all resolved values in insertion order.
   * Resolves the full collection before yielding — use
   * {@link AsyncLazyCollection} for true streaming behaviour.
   *
   * @example
   * ```ts
   * for await (const item of new AsyncCollection([Promise.resolve(1)])) {
   *   console.log(item);
   * }
   * ```
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<T, void, unknown> {
    for (const item of await this._resolve()) yield item;
  }

  /**
   * Resolve and materialize all Promises into a plain array.
   * Runs all Promises concurrently — results are ordered
   * by input position, not by resolution time.
   *
   * @returns  A `Promise<T[]>` resolving when all items are ready.
   *
   * @example
   * ```ts
   * await new AsyncCollection([
   *   Promise.resolve('a'),
   *   Promise.resolve('b'),
   * ]).all(); // ['a', 'b']
   * ```
   */
  async all(): Promise<T[]> {
    return this._resolve();
  }

  /**
   * Resolve internal items regardless of their shape.
   * Handles both `Promise<T>[]` from the constructor and
   * `Promise<T[]>` from operator chaining transparently.
   *
   * @internal
   */
  private _resolve(): Promise<T[]> {
    if (this.items instanceof Promise) {
      return this.items;
    }
    return Promise.all(this.items);
  }
}
