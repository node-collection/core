import { AsyncEnumerable, AsyncLazyEnumerableMethods } from '@/core/contracts/enumerable';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface AsyncLazyCollection<T> extends AsyncEnumerable<T>, AsyncLazyEnumerableMethods<T> {}

/**
 * A lazy, asynchronous collection backed by any `AsyncIterable<T>`.
 *
 * Items are pulled on-demand — nothing executes until you iterate with
 * `for await...of` or call `all`. Operator chains compose async
 * generators transparently, keeping memory usage constant relative to
 * the number of concurrently in-flight items rather than the total
 * dataset size.
 *
 * `AsyncLazyCollection` is the natural fit for:
 * - Node.js `Readable` streams and `stream.pipeline` sources.
 * - Paginated API cursors that yield pages on demand.
 * - Infinite async sequences (e.g. event emitters, message queues).
 * - Any pipeline where you want to process-and-discard items rather
 *   than buffer the full result set.
 *
 * Settlement tracking (`_resolvedCount`, `_rejectedCount`, `_errors`)
 * is updated **incrementally** as items are yielded, making it safe
 * to call `resolved`, `rejected`, and `errors`
 * mid-iteration to check pipeline health without waiting for completion.
 *
 * @typeParam T - The type of values yielded by the async iterable.
 *
 * @see `collect` — preferred factory function
 * @see `AsyncCollection` — eager async alternative
 * @see `LazyCollection` — lazy sync counterpart
 *
 * @example
 * ```ts
 * async function* paginate(endpoint: string) {
 *   let cursor: string | null = 'start';
 *   while (cursor) {
 *     const { items, nextCursor } = await fetch(`${endpoint}?cursor=${cursor}`)
 *       .then(r => r.json());
 *     yield* items;
 *     cursor = nextCursor ?? null;
 *   }
 * }
 *
 * for await (const record of collect(paginate('/api/records')).map(transform)) {
 *   await save(record);
 *   console.log(`Saved ${col.resolved()} records so far`);
 * }
 * ```
 *
 * @category Engine
 */
export class AsyncLazyCollection<T> {
  /**
   * Number of items successfully pulled and yielded from the source.
   * Incremented by one per yield inside the async iterator.
   *
   * @internal
   */
  protected _processed = 0;

  /**
   * The most recently yielded item. `undefined` before iteration.
   *
   * @internal
   */
  protected _current: T | undefined;

  /**
   * Cached total element count. `null` until the source is fully drained.
   * Set at the end of a complete iteration pass.
   *
   * @internal
   */
  protected _total: number | null = null;

  /**
   * Number of items successfully yielded (mirrors `_processed`).
   * Maintained separately to clearly express settlement semantics.
   *
   * @internal
   */
  protected _resolvedCount = 0;

  /**
   * Number of errors encountered during async iteration.
   *
   * @internal
   */
  protected _rejectedCount = 0;

  /**
   * Errors thrown by the source during async iteration.
   *
   * @internal
   */
  protected _errors: Error[] = [];

  /**
   * Creates a new `AsyncLazyCollection` wrapping the given async iterable.
   *
   * The source is **not consumed** on construction — no items are pulled
   * until the first `await iter.next()`. If the source is a one-shot async
   * generator, it can only be iterated once; a second `for await...of`
   * will yield nothing.
   *
   * @param source - Any `AsyncIterable<T>` — async generators, Node.js
   *   Readable streams (in object mode), `ReadableStream`, or any object
   *   implementing `[Symbol.asyncIterator]`.
   *
   * @example
   * ```ts
   * async function* gen() { yield 1; yield 2; yield 3; }
   *
   * const col = new AsyncLazyCollection(gen());
   * // or via the factory:
   * const col = collect(gen());
   * ```
   */
  constructor(protected source: AsyncIterable<T>) {}

  // ─── Iteration ────────────────────────────────────────────────────────────

  /**
   * Async-iterates over elements from the source one at a time.
   *
   * Each item is pulled lazily — only the item currently being processed
   * occupies working memory at any given moment. Operator pipelines composed
   * via `defineOperator` stack as async generator wrappers, so the pull-based
   * nature is preserved end-to-end.
   *
   * Updates `_current`, `_processed`, and `_resolvedCount` with each
   * successful yield. Captures errors in `_rejectedCount` and `_errors`,
   * then re-throws so the caller's `try/catch` or stream error handler
   * can respond.
   *
   * When the source is fully exhausted, `_total` is set to `_processed`
   * so that subsequent calls to `total` and `progress` return
   * accurate figures without re-traversing.
   *
   * @yields Each item `T` as it is pulled from the source.
   *
   * @throws Re-throws any error raised by the source during iteration.
   *
   * @example
   * ```ts
   * async function* gen() { yield 'a'; yield 'b'; yield 'c'; }
   *
   * const col = collect(gen());
   *
   * for await (const item of col) {
   *   console.log(item); // 'a', 'b', 'c'
   * }
   * ```
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<T, void, unknown> {
    try {
      for await (const item of this.source) {
        this._current = item;
        this._resolvedCount++;
        yield item;
        this._processed++;
      }
      this._total = this._processed;
    } catch (err) {
      this._rejectedCount++;
      this._errors.push(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  // ─── Terminal methods ─────────────────────────────────────────────────────

  /**
   * Eagerly drains the async iterable into a plain array.
   *
   * Passes through `this[Symbol.asyncIterator]()` so that all tracking state
   * (`_processed`, `_resolvedCount`, `_total`) is correctly populated after
   * the drain completes. After `all()` returns, `total` and
   * `progress` will return accurate figures.
   *
   * @remarks **Do not call on infinite sequences** — this method will never
   * resolve if the source never completes. For infinite sources, consume
   * items via `for await...of` and `break` when done.
   *
   * @returns A `Promise<T[]>` that resolves after every item has been yielded.
   *
   * @example
   * ```ts
   * async function* gen() { yield 100; yield 200; yield 300; }
   *
   * const items = await collect(gen()).all();
   * // [100, 200, 300]
   * ```
   */
  async all(): Promise<T[]> {
    const result: T[] = [];
    for await (const item of this) result.push(item);
    return result;
  }

  /**
   * Alias for `all`. Drains the async iterable into a plain array.
   *
   * @returns A `Promise<T[]>` of all yielded items.
   *
   * @example
   * ```ts
   * const arr = await collect(asyncReadableStream()).toArray();
   * ```
   */
  async toArray(): Promise<T[]> {
    return this.all();
  }

  /**
   * Alias for `all`. Called automatically by `JSON.stringify`.
   *
   * @returns A `Promise<T[]>` of all yielded items.
   *
   * @example
   * ```ts
   * const json = JSON.stringify(await collect(gen()).toJSON());
   * ```
   */
  async toJSON(): Promise<T[]> {
    return this.all();
  }

  // ─── Quantifiers ─────────────────────────────────────────────────────────

  /**
   * Returns the total number of elements yielded by the source.
   *
   * Delegates to `total`. Use `count()` when the semantic intent
   * is "how many items were there" and `total()` when framing throughput.
   *
   * @returns A `Promise<number>` resolving to the element count.
   *
   * @example
   * ```ts
   * await collect(gen()).count(); // drains source if not yet consumed
   * ```
   */
  async count(): Promise<number> {
    return this.total();
  }

  /**
   * Returns the total number of elements in the source.
   *
   * - If the source has been **fully consumed** (via `all` or a
   *   completed `for await...of`), returns the cached `_total` immediately.
   * - Otherwise, **drains the source** to determine the count, setting
   *   `_total` for future calls.
   *
   * @remarks **Calling `total()` mid-stream on a one-shot generator will
   * consume and exhaust it**, leaving nothing for subsequent iteration.
   * Only call `total()` upfront if the source is re-iterable (e.g. a
   * Node.js stream that can be recreated), or after a full drain.
   *
   * @returns A `Promise<number>` resolving to the exact element count.
   *
   * @example
   * ```ts
   * const col = collect(gen());
   * await col.all();       // drain first
   * await col.total();     // returns cached count immediately
   * ```
   */
  async total(): Promise<number> {
    if (this._total !== null) return this._total;
    await this.all();
    return this._total!;
  }

  /**
   * Returns the most recently yielded item during async iteration.
   *
   * Returns `undefined` before the first yield. Safe to call mid
   * `for await...of` loop.
   *
   * @returns A `Promise<T>` resolving to the current item.
   *
   * @example
   * ```ts
   * const col = collect(gen());
   *
   * for await (const item of col) {
   *   const same = await col.current();
   *   console.log(same === item); // true
   * }
   * ```
   */
  async current(): Promise<T> {
    return this._current as T;
  }

  /**
   * Returns the number of items not yet yielded relative to the known total.
   *
   * Returns `0` if the total is not yet known (i.e. the source has not been
   * fully drained). This is intentional — `remaining()` will **not** implicitly
   * drain the source to compute an accurate figure. If you need the value
   * before a full drain, call `await col.total()` first.
   *
   * @returns A `Promise<number>` resolving to the remaining count,
   *   or `0` if the total is unknown.
   *
   * @example
   * ```ts
   * const col = collect(gen());
   * await col.all(); // drain to populate _total
   *
   * for await (const _ of col) {
   *   console.log(await col.remaining()); // decrements per item
   * }
   * ```
   */
  async remaining(): Promise<number> {
    if (this._total === null) return 0;
    return this._total - this._processed;
  }

  /**
   * Returns the percentage of items yielded relative to the known total (0–100).
   *
   * Returns `0` if the total is not yet known or is zero.
   * Becomes meaningful after a full drain or on a second iteration pass
   * (when `_total` is cached from the first pass).
   *
   * @returns A `Promise<number>` resolving to an integer between `0` and `100`.
   *
   * @example
   * ```ts
   * const col = collect(gen()); // 4 items
   * await col.all();            // populate _total = 4
   *
   * let i = 0;
   * for await (const _ of col) {
   *   if (++i === 2) console.log(await col.progress()); // 50
   * }
   * ```
   */
  async progress(): Promise<number> {
    if (this._total === null || this._total === 0) return 0;
    return Math.round((this._processed / this._total) * 100);
  }

  // ─── Settlement state (sync) ──────────────────────────────────────────────

  /**
   * Returns the number of items successfully yielded so far.
   *
   * **Synchronous** — incremented per item during iteration. Safe to call
   * mid `for await...of` loop to monitor pipeline throughput in real time.
   *
   * @remarks The method name preserves an intentional typo in the
   * `AsyncEnumerable` contract.
   *
   * @returns The fulfilled item count as a plain number.
   *
   * @example
   * ```ts
   * const col = collect(paginate('/api/records'));
   *
   * for await (const record of col) {
   *   await save(record);
   *   if (col.resolved() % 100 === 0) {
   *     console.log(`Processed ${col.resolved()} records`);
   *   }
   * }
   * ```
   */
  resolved(): number {
    return this._resolvedCount;
  }

  /**
   * Returns the number of errors encountered during async iteration.
   *
   * **Synchronous** — a single error thrown by the source increments this
   * by `1` and halts the pipeline (the error is re-thrown). Call after
   * a `try/catch` around your iteration loop to inspect the failure count.
   *
   * @returns The rejection count as a plain number.
   *
   * @example
   * ```ts
   * const col = collect(flakyStream());
   *
   * try {
   *   for await (const item of col) {
   *     process(item);
   *   }
   * } catch {
   *   console.error(`Failed after ${col.resolved()} items, ${col.rejected()} errors`);
   *   console.error(col.errors()[0]);
   * }
   * ```
   */
  rejected(): number {
    return this._rejectedCount;
  }

  /**
   * Returns all errors thrown by the source during async iteration.
   *
   * **Synchronous** — returns a **shallow copy** of the internal error buffer.
   * Mutations to the returned array do not affect the collection's internal
   * state.
   *
   * @returns A `Error[]` shallow copy of all iteration errors.
   *
   * @example
   * ```ts
   * try {
   *   await collect(flakyStream()).all();
   * } catch {
   *   col.errors().forEach(e => logger.error(e));
   * }
   * ```
   */
  errors(): Error[] {
    return [...this._errors];
  }

  // ─── Introspection ────────────────────────────────────────────────────────

  /**
   * Returns a human-readable label for logging and assertion messages.
   *
   * Format: `"[NodeCollections::AsyncLazyCollection (Pulled: {n}, Errors: {m})]"`.
   *
   * @returns The string label.
   *
   * @example
   * ```ts
   * const col = collect(gen());
   * col.toString();
   * // "[NodeCollections::AsyncLazyCollection (Pulled: 0, Errors: 0)]"
   * ```
   */
  toString(): string {
    return `[NodeCollections::${this.constructor.name} (Pulled: ${this._processed}, Errors: ${this._rejectedCount})]`;
  }

  /**
   * Custom Node.js `util.inspect` formatter.
   *
   * Called by `console.log`, `util.inspect`, and the Node.js REPL.
   * Reports processed/total ratio and settlement counts without
   * triggering further evaluation.
   *
   * @returns A formatted inspection string.
   *
   * @example
   * ```ts
   * console.log(collect(gen()));
   * // AsyncLazyCollection {
   * //   processed: 0/unknown,
   * //   resolved: 0,
   * //   rejected: 0
   * // }
   * ```
   */
  [Symbol.for('nodejs.util.inspect.custom')]() {
    const total = this._total !== null ? this._total : 'unknown';
    return (
      `${this.constructor.name} {\n` +
      `  processed: ${this._processed}/${total},\n` +
      `  resolved: ${this._resolvedCount},\n` +
      `  rejected: ${this._rejectedCount}\n` +
      `}`
    );
  }
}
