import { AsyncEnumerable, AsyncLazyEnumerableMethods } from '@/core/contracts/enumerable';

export interface AsyncLazyCollection<T> extends AsyncEnumerable<T>, AsyncLazyEnumerableMethods<T> {}

/**
 * A lazy, async collection backed by any `AsyncIterable<T>`.
 * Items are pulled on-demand — nothing runs until you
 * iterate with `for await...of` or call {@link all}.
 *
 * The natural fit for async generators, Node.js streams,
 * paginated API cursors, or infinite async sequences.
 * Operator chains compose generators without triggering
 * resolution, keeping memory usage constant.
 *
 * @typeParam T - The type of values yielded by the async iterable.
 *
 * @example
 * ```ts
 * async function* paginate(cursor: string) {
 *   while (cursor) {
 *     const page = await fetchPage(cursor);
 *     yield* page.items;
 *     cursor = page.nextCursor;
 *   }
 * }
 *
 * for await (const item of new AsyncLazyCollection(paginate('start'))) {
 *   process(item);
 * }
 * ```
 *
 * @category  Engine
 */
export class AsyncLazyCollection<T> {
  /**
   * Create a new AsyncLazyCollection wrapping the given async iterable.
   * The source is not consumed on construction —
   * evaluation defers until the first `await iter.next()`.
   *
   * @param   source  Any `AsyncIterable<T>` to wrap.
   */
  constructor(protected source: AsyncIterable<T>) {}

  /**
   * Async-iterate over elements from the source one at a time.
   * Each value is pulled lazily — only the currently
   * requested item occupies memory at any given moment.
   *
   * @example
   * ```ts
   * async function* gen() { yield 1; yield 2; yield 3; }
   *
   * for await (const item of new AsyncLazyCollection(gen())) {
   *   console.log(item);
   * }
   * ```
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<T, void, unknown> {
    let count = 0;
    try {
      for await (const item of this.source) {
        yield item;
        count++;
      }
    } catch (err) {
      throw err;
    } finally {
    }
  }

  /**
   * Eagerly drain the async iterable into a plain array.
   * Triggers full evaluation of the async generator chain —
   * avoid on infinite sequences or when streaming
   * is sufficient for your use case.
   *
   * @returns  A `Promise<T[]>` resolving after all items are yielded.
   *
   * @example
   * ```ts
   * async function* gen() { yield 100; yield 200; }
   *
   * await new AsyncLazyCollection(gen()).all(); // [100, 200]
   * ```
   */
  async all(): Promise<T[]> {
    const result: T[] = [];
    for await (const item of this.source) result.push(item);
    return result;
  }
}
