import { AsyncEnumerable, AsyncEnumerableMethods } from '@/core/contracts/enumerable';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface AsyncCollection<T> extends AsyncEnumerable<T>, AsyncEnumerableMethods<T> {}

/**
 * An eager, asynchronous collection backed by an array of Promises.
 *
 * All Promises are settled concurrently via `Promise.allSettled`, preserving
 * input order regardless of resolution time. Partial success is the default
 * semantics — if some Promises reject, the fulfilled values are still
 * accessible via `all`, while rejections are captured in `errors`.
 *
 * Resolution is **lazy-cached** — the first call to `all`, `toArray`,
 * or the async iterator triggers settlement; every subsequent call reuses
 * the cached result without re-resolving the original Promises.
 *
 * Operator chains registered via `defineOperator` return a new
 * `AsyncCollection` synchronously (wrapping a `Promise<T[]>`) so the
 * fluent API remains chainable. Only terminal methods trigger actual
 * Promise settlement.
 *
 * Choose `AsyncCollection` when:
 * - You have a fixed array of Promises to resolve concurrently.
 * - You need partial-success semantics (failed Promises should not abort
 *   the entire pipeline).
 * - You want to inspect `rejected()` and `errors()` after resolution.
 *
 * For unbounded or streaming async data, prefer `AsyncLazyCollection`.
 *
 * @typeParam T - The resolved value type of each Promise.
 *
 * @see `collect` — preferred factory function
 * @see `AsyncLazyCollection` — lazy async alternative
 *
 * @example
 * ```ts
 * const col = collect([
 *   fetch('/api/users/1').then(r => r.json()),
 *   fetch('/api/users/2').then(r => r.json()),
 *   Promise.reject(new Error('403 Forbidden')),
 * ]);
 *
 * const users = await col.all();
 * // [{ id: 1, ... }, { id: 2, ... }]  — partial success
 *
 * col.rejected(); // 1
 * col.errors();   // [Error: 403 Forbidden]
 * ```
 *
 * @category Engine
 */
export class AsyncCollection<T> {
  /**
   * Memoised result after first settlement. `null` until resolved.
   *
   * @internal
   */
  private _cache: T[] | null = null;

  /**
   * Total input count. Known synchronously for `Promise<T>[]`;
   * resolved after settlement for `Promise<T[]>`.
   *
   * @internal
   */
  private _total: number | null = null;

  /**
   * Iterator cursor — advanced per yielded item during async iteration.
   *
   * @internal
   */
  private _cursor = 0;

  /**
   * The most recently yielded item during async iteration.
   *
   * @internal
   */
  private _current: T | undefined;

  /**
   * Count of Promises that fulfilled successfully.
   *
   * @internal
   */
  private _resolvedCount = 0;

  /**
   * Count of Promises that rejected.
   *
   * @internal
   */
  private _rejectedCount = 0;

  /**
   * Errors collected from rejected Promises.
   *
   * @internal
   */
  private _errors: Error[] = [];

  /**
   * Creates a new `AsyncCollection` from an array of Promises
   * or a pre-resolved `Promise<T[]>`.
   *
   * Passing a `Promise<T[]>` (produced by operator chains like `map`)
   * avoids wrapping an already-resolved array in a redundant `Promise.allSettled`.
   * The concrete input type is detected internally via `instanceof Promise`.
   *
   * For `Promise<T>[]` inputs, `_total` is set synchronously from the array
   * length so that `total` and `remaining` can return meaningful
   * values before settlement completes.
   *
   * @param items - An array of `Promise<T>` or a single `Promise<T[]>`.
   *
   * @example
   * ```ts
   * // From individual Promises:
   * const col = new AsyncCollection([fetchUser(1), fetchUser(2)]);
   *
   * // Via the factory (preferred):
   * const col = collect([fetchUser(1), fetchUser(2)]);
   * ```
   */
  constructor(protected items: Promise<T>[] | Promise<T[]>) {
    if (Array.isArray(items)) {
      this._total = items.length;
    }
  }

  // ─── Internal settlement ──────────────────────────────────────────────────

  /**
   * Settles all Promises exactly once and caches the result.
   *
   * For `Promise<T>[]` inputs, `Promise.allSettled` is used so that
   * individual rejections do not short-circuit the pipeline. Each outcome
   * is examined and routed to either the result array or the error buffer.
   *
   * For `Promise<T[]>` inputs (from operator chains), the single Promise is
   * awaited directly. If it rejects, the error is captured and an empty array
   * is returned.
   *
   * @returns A `Promise<T[]>` of all fulfilled values, ordered by input position.
   *
   * @internal
   */
  private async _settle(): Promise<T[]> {
    if (this._cache !== null) return this._cache;

    if (this.items instanceof Promise) {
      try {
        const result = await this.items;
        this._resolvedCount = result.length;
        this._total = result.length;
        this._cache = result;
        return result;
      } catch (err) {
        this._rejectedCount++;
        this._errors.push(err instanceof Error ? err : new Error(String(err)));
        this._cache = [];
        return this._cache;
      }
    }

    this._total = this.items.length;
    const settled = await Promise.allSettled(this.items);
    const result: T[] = [];

    for (const outcome of settled) {
      if (outcome.status === 'fulfilled') {
        this._resolvedCount++;
        result.push(outcome.value);
      } else {
        this._rejectedCount++;
        this._errors.push(outcome.reason instanceof Error ? outcome.reason : new Error(String(outcome.reason)));
      }
    }

    this._cache = result;
    return result;
  }

  // ─── Iteration ────────────────────────────────────────────────────────────

  /**
   * Async-iterates over all resolved values in input order.
   *
   * Triggers settlement on the first call via `_settle`. Subsequent
   * `for await...of` loops replay items from the cache without re-resolving
   * the original Promises. The cursor resets to `0` at the start of each pass.
   *
   * @yields Each fulfilled value `T` in input order.
   *
   * @example
   * ```ts
   * const col = collect([Promise.resolve(1), Promise.resolve(2)]);
   *
   * for await (const item of col) {
   *   console.log(item); // 1, then 2
   * }
   *
   * // Safe to iterate again — replays from cache:
   * for await (const item of col) {
   *   console.log(item); // 1, then 2
   * }
   * ```
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<T, void, unknown> {
    this._cursor = 0;
    const items = await this._settle();
    try {
      for (const item of items) {
        this._current = item;
        yield item;
        this._cursor++;
      }
    } catch (err) {
      throw err;
    }
  }

  // ─── Terminal methods ─────────────────────────────────────────────────────

  /**
   * Settles and materialises all fulfilled Promises into a plain array.
   *
   * Uses `Promise.allSettled` internally — rejected Promises do not abort
   * the pipeline. Fulfilled values are returned in input order; rejections
   * are collected silently and accessible via `rejected` and `errors`.
   *
   * The result is **memoised** — calling `all()` multiple times is safe and
   * cheap after the first resolution.
   *
   * @returns A `Promise<T[]>` resolving to all fulfilled values.
   *
   * @example
   * ```ts
   * const col = collect([
   *   Promise.resolve('alpha'),
   *   Promise.reject(new Error('network error')),
   *   Promise.resolve('gamma'),
   * ]);
   *
   * await col.all();    // ['alpha', 'gamma']
   * col.rejected();     // 1
   * col.errors()[0];    // Error: network error
   * ```
   */
  async all(): Promise<T[]> {
    return this._settle();
  }

  /**
   * Alias for `all`. Materialises fulfilled values as a plain array.
   *
   * @returns A `Promise<T[]>` of all fulfilled values.
   *
   * @example
   * ```ts
   * const arr = await collect([p1, p2, p3]).toArray();
   * ```
   */
  async toArray(): Promise<T[]> {
    return this.all();
  }

  /**
   * Alias for `all`. Called automatically by `JSON.stringify`.
   *
   * @returns A `Promise<T[]>` of all fulfilled values.
   *
   * @example
   * ```ts
   * const json = JSON.stringify(await collect([p1, p2]).toJSON());
   * ```
   */
  async toJSON(): Promise<T[]> {
    return this.all();
  }

  // ─── Quantifiers ─────────────────────────────────────────────────────────

  /**
   * Returns the total number of inputs (fulfilled + rejected).
   *
   * Triggers settlement if the total is not yet known (e.g. when
   * constructed with a `Promise<T[]>` from an operator chain).
   * For `Promise<T>[]` inputs, this resolves immediately without
   * awaiting any Promises.
   *
   * @returns A `Promise<number>` resolving to the total input count.
   *
   * @example
   * ```ts
   * const col = collect([p1, p2, p3]);
   * await col.total(); // 3  — resolves immediately for Promise<T>[]
   * ```
   */
  async total(): Promise<number> {
    if (this._total !== null) return this._total;
    await this._settle();
    return this._total!;
  }

  /**
   * Returns the count of fulfilled items.
   *
   * Triggers settlement if the collection has not yet resolved.
   * Alias for `total()` after resolution — both return the same
   * value when there are no rejections.
   *
   * @returns A `Promise<number>` resolving to the fulfilled item count.
   *
   * @example
   * ```ts
   * const col = collect([Promise.resolve(1), Promise.resolve(2)]);
   * await col.count(); // 2
   * ```
   */
  async count(): Promise<number> {
    return this.total();
  }

  /**
   * Returns the most recently yielded item during async iteration.
   *
   * Returns `undefined` before iteration begins. Safe to call at any
   * point mid `for await...of` loop.
   *
   * @returns A `Promise<T>` resolving to the current item.
   *
   * @example
   * ```ts
   * const col = collect([Promise.resolve('a'), Promise.resolve('b')]);
   *
   * for await (const item of col) {
   *   const current = await col.current();
   *   console.log(current === item); // true
   * }
   * ```
   */
  async current(): Promise<T> {
    return this._current as T;
  }

  /**
   * Returns the number of items not yet consumed by the current pass.
   *
   * For `Promise<T>[]` inputs, this is computable before settlement because
   * `_total` is known from the array length. The value decrements with each
   * yielded item during `for await...of`.
   *
   * @returns A `Promise<number>` resolving to the remaining item count.
   *
   * @example
   * ```ts
   * const col = collect([p1, p2, p3, p4]);
   * let i = 0;
   *
   * for await (const _ of col) {
   *   if (++i === 2) console.log(await col.remaining()); // 2
   * }
   * ```
   */
  async remaining(): Promise<number> {
    const total = await this.total();
    return total - this._cursor;
  }

  /**
   * Returns the percentage of items yielded in the current pass (0–100).
   *
   * Calculated as `Math.round((cursor / total) * 100)`.
   * Returns `0` when total is `0`.
   *
   * @returns A `Promise<number>` resolving to an integer between `0` and `100`.
   *
   * @example
   * ```ts
   * const col = collect([p1, p2, p3, p4]);
   * let i = 0;
   *
   * for await (const _ of col) {
   *   if (++i === 1) console.log(await col.progress()); // 25
   * }
   * ```
   */
  async progress(): Promise<number> {
    const total = await this.total();
    if (total === 0) return 0;
    return Math.round((this._cursor / total) * 100);
  }

  // ─── Settlement state (sync) ──────────────────────────────────────────────

  /**
   * Returns the count of Promises that have fulfilled.
   *
   * **Synchronous** — reflects accumulated state without triggering
   * further resolution. Returns `0` before `all` or the async
   * iterator is first invoked.
   *
   * @remarks The method name preserves an intentional typo in the
   * `AsyncEnumerable` contract. See also the `resolved()` alias if
   * added via module augmentation.
   *
   * @returns The fulfilled Promise count as a plain number.
   *
   * @example
   * ```ts
   * const col = collect([Promise.resolve(1), Promise.resolve(2)]);
   * await col.all();
   * col.resolved(); // 2
   * ```
   */
  resolved(): number {
    return this._resolvedCount;
  }

  /**
   * Returns the count of Promises that have rejected.
   *
   * **Synchronous** — safe to call at any point after `all` completes.
   * Pair with `errors` to retrieve the actual failure reasons.
   *
   * @returns The rejected Promise count as a plain number.
   *
   * @example
   * ```ts
   * const col = collect([
   *   Promise.resolve('ok'),
   *   Promise.reject(new Error('timeout')),
   * ]);
   * await col.all();
   * col.rejected(); // 1
   * ```
   */
  rejected(): number {
    return this._rejectedCount;
  }

  /**
   * Returns all errors collected from rejected Promises.
   *
   * **Synchronous** — returns a **shallow copy** of the internal error buffer.
   * Mutations to the returned array do not affect the collection. Errors are
   * ordered by input position, not by rejection time.
   *
   * @returns A `Error[]` shallow copy of all rejection errors.
   *
   * @example
   * ```ts
   * const col = collect([
   *   fetchUser(1),
   *   Promise.reject(new Error('404 Not Found')),
   *   Promise.reject(new TypeError('invalid response')),
   * ]);
   * await col.all();
   *
   * col.errors().forEach(e => console.error(e.message));
   * // "404 Not Found"
   * // "invalid response"
   * ```
   */
  errors(): Error[] {
    return [...this._errors];
  }

  // ─── Introspection ────────────────────────────────────────────────────────

  /**
   * Returns a human-readable label for logging and assertion messages.
   *
   * Format: `"[NodeCollections::AsyncCollection ({resolved} resolved,`
   * `{rejected} rejected / {total} total)]"`.
   *
   * @returns The string label.
   *
   * @example
   * ```ts
   * const col = collect([p1, p2, p3]);
   * col.toString();
   * // "[NodeCollections::AsyncCollection (0 resolved, 0 rejected / 3 total)]"
   *
   * await col.all();
   * col.toString();
   * // "[NodeCollections::AsyncCollection (3 resolved, 0 rejected / 3 total)]"
   * ```
   */
  toString(): string {
    const total = this._total ?? '?';
    return `[NodeCollections::${this.constructor.name} (${this._resolvedCount} resolved, ${this._rejectedCount} rejected / ${total} total)]`;
  }

  /**
   * Custom Node.js `util.inspect` formatter.
   *
   * Called by `console.log`, `util.inspect`, and the Node.js REPL.
   * Reports settlement counts and cursor position without triggering
   * further resolution.
   *
   * @returns A formatted inspection string.
   *
   * @example
   * ```ts
   * console.log(collect([p1, p2]));
   * // AsyncCollection {
   * //   resolved: 0,
   * //   rejected: 0,
   * //   errors: 0,
   * //   cursor: 0/2
   * // }
   * ```
   */
  [Symbol.for('nodejs.util.inspect.custom')]() {
    return (
      `${this.constructor.name} {\n` +
      `  resolved: ${this._resolvedCount},\n` +
      `  rejected: ${this._rejectedCount},\n` +
      `  errors: ${this._errors.length},\n` +
      `  cursor: ${this._cursor}/${this._total ?? '?'}\n` +
      `}`
    );
  }
}
