import { Enumerable, LazyEnumerableMethods } from '@/core/contracts/enumerable';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface LazyCollection<T> extends Enumerable<T>, LazyEnumerableMethods<T> {}

/**
 * A lazy, synchronous collection backed by any `Iterable<T>`.
 *
 * Operator chains are composed as generator pipelines — no work is
 * performed until you iterate with `for...of` or call `all`.
 * This keeps memory usage constant relative to the element count,
 * making `LazyCollection` the right choice for large datasets,
 * infinite sequences, or pipelines where only a subset of elements
 * will actually be consumed.
 *
 * Choose `LazyCollection` when:
 * - Your source is a generator, `Set`, `Map`, or other non-array iterable.
 * - You need to process millions of records without buffering them all.
 * - You plan to `break` out of a loop early and discard the rest.
 *
 * For datasets already in memory as plain arrays, the simpler
 * `Collection` is more convenient. For async sources, see
 * `AsyncLazyCollection`.
 *
 * @typeParam T - The type of elements yielded by the source iterable.
 *
 * @see `collect` — preferred factory function
 * @see `Collection` — eager sync alternative
 * @see `AsyncLazyCollection` — lazy async counterpart
 *
 * @example
 * ```ts
 * function* naturals() {
 *   let n = 0;
 *   while (true) yield n++;
 * }
 *
 * // Only the first 5 even numbers are ever computed:
 * const result = collect(naturals())
 *   .filter(n => n % 2 === 0)
 *   .take(5)
 *   .all();
 * // [0, 2, 4, 6, 8]
 * ```
 *
 * @category Engine
 */
export class LazyCollection<T> {
  /**
   * Number of elements successfully pulled from the source.
   * Incremented by one for each item yielded during iteration.
   *
   * @internal
   */
  protected _processed = 0;

  /**
   * The most recently yielded element, or `undefined` before iteration.
   *
   * @internal
   */
  protected _current: T | undefined;

  /**
   * Cached total element count. `null` until the source is fully
   * traversed or the count is determinable from the source type.
   *
   * @internal
   */
  protected _total: number | null = null;

  /**
   * Creates a new `LazyCollection` wrapping the given iterable.
   *
   * The source is **not consumed** on construction — no elements are
   * pulled until iteration begins. If you pass a generator function's
   * result, it will be exhausted on the first full pass and yield nothing
   * on a second pass.
   *
   * @param source - Any `Iterable<T>` — arrays, Sets, Maps, generators,
   *   or any object implementing `[Symbol.iterator]`.
   *
   * @example
   * ```ts
   * const col = new LazyCollection(new Set([1, 2, 3]));
   * // or via the factory:
   * const col = collect(new Set([1, 2, 3]));
   * ```
   */
  constructor(protected source: Iterable<T>) {}

  // ─── Terminal methods ─────────────────────────────────────────────────────

  /**
   * Eagerly materialises all deferred elements into a plain array.
   *
   * Triggers full evaluation of the generator pipeline. If the source
   * is a one-shot generator, subsequent calls to `all()` will return
   * an empty array — generators are not re-windable. Use a source
   * that is re-iterable (e.g. a `Set`, or an array wrapped in a
   * factory function) if you need multiple passes.
   *
   * @returns A new `T[]` containing every yielded element.
   *
   * @example
   * ```ts
   * function* range(n: number) {
   *   for (let i = 0; i < n; i++) yield i;
   * }
   *
   * collect(range(5)).all(); // [0, 1, 2, 3, 4]
   * ```
   */
  all(): T[] {
    const result = Array.from(this.source);
    this._processed += result.length;
    this._total = this._processed;
    return result;
  }

  /**
   * Alias for `all`. Materialises all elements into a plain array.
   *
   * @returns A new `T[]` containing every element.
   *
   * @example
   * ```ts
   * collect(new Map([['a', 1], ['b', 2]])).toArray();
   * // [['a', 1], ['b', 2]]
   * ```
   */
  toArray(): T[] {
    return this.all();
  }

  /**
   * Serialises the collection to a plain array for `JSON.stringify`.
   *
   * Called automatically by `JSON.stringify`. Delegates to `all`
   * so the output is identical to a full materialisation.
   *
   * @returns A new `T[]` in iteration order.
   *
   * @example
   * ```ts
   * JSON.stringify(collect(new Set([1, 2, 3])));
   * // '[1,2,3]'
   * ```
   */
  toJSON(): T[] {
    return this.all();
  }

  // ─── Quantifiers ─────────────────────────────────────────────────────────

  /**
   * Returns the total number of elements in the source iterable.
   *
   * Delegates to `total`. Provided for API symmetry with
   * `Collection`. See `total()` for detailed behaviour notes.
   *
   * @returns The element count as a plain number.
   *
   * @example
   * ```ts
   * collect(new Set([1, 2, 3])).count(); // 3
   * ```
   */
  count(): number {
    return this.total();
  }

  /**
   * Returns the total number of elements in the source iterable.
   *
   * Resolution strategy (in order):
   * 1. Returns the cached `_total` if the source has already been traversed.
   * 2. Returns `source.length` for arrays (O(1)).
   * 3. Returns `source.size` for `Set` and `Map` (O(1)).
   * 4. **Fully traverses** the source to count elements (O(n)) and caches
   *    the result. Note: this exhausts one-shot generators.
   *
   * @remarks Calling `total()` on an exhausted generator returns the
   * cached count from the previous traversal — it does not re-traverse.
   *
   * @returns The element count as a plain number.
   *
   * @example
   * ```ts
   * collect([1, 2, 3, 4, 5]).total(); // 5  — O(1)
   * collect(new Set([1, 2, 3])).total(); // 3  — O(1)
   *
   * function* gen() { yield 1; yield 2; }
   * collect(gen()).total(); // 2  — O(n), traverses generator
   * ```
   */
  total(): number {
    if (this._total !== null) return this._total;
    if (Array.isArray(this.source)) return this.source.length;
    if (this.source instanceof Set || this.source instanceof Map) return this.source.size;
    let count = 0;
    for (const _ of this.source) count++;
    this._total = count;
    return count;
  }

  /**
   * Returns the element at the current iterator cursor position.
   *
   * Updated with each item yielded during a `for...of` loop.
   * Returns `undefined` before the first iteration begins.
   *
   * @returns The current element, or `undefined`.
   *
   * @example
   * ```ts
   * const col = collect(new Set([10, 20, 30]));
   *
   * for (const item of col) {
   *   console.log(col.current()); // 10, then 20, then 30
   * }
   * ```
   */
  current(): T | undefined {
    return this._current;
  }

  /**
   * Returns the number of elements not yet consumed by the current pass.
   *
   * Calls `total` internally — be aware this may trigger a full
   * source traversal if the total is not yet cached. Returns `null`
   * if `total()` cannot determine the count without exhausting the source
   * (this case does not arise in the current implementation, but subclasses
   * may override `total()` to return a sentinel).
   *
   * @returns The remaining element count, or `null` if unknown.
   *
   * @example
   * ```ts
   * const col = collect(new Set([1, 2, 3, 4]));
   *
   * for (const _ of col) {
   *   console.log(col.remaining()); // 3, 2, 1, 0
   * }
   * ```
   */
  remaining(): number | null {
    return this.total() - this.processed();
  }

  /**
   * Returns the percentage of elements yielded in the current pass (0–100).
   *
   * Returns `0` if total is zero or not yet known.
   *
   * @returns An integer between `0` and `100` inclusive.
   *
   * @example
   * ```ts
   * const col = collect([1, 2, 3, 4]);
   * let i = 0;
   *
   * for (const _ of col) {
   *   if (++i === 3) console.log(col.progress()); // 75
   * }
   * ```
   */
  progress(): number {
    const total = this.total();
    if (!total || total === 0) return 0;
    return Math.round((this._processed / total) * 100);
  }

  /**
   * Returns the number of elements consumed so far.
   *
   * Incremented by one for each item yielded during `for...of`.
   * After a full pass equals `total()`. Unlike `Collection`,
   * this is not reset between passes on lazy collections — each
   * call to `all()` accumulates into this counter.
   *
   * @returns The processed element count as a plain number.
   *
   * @example
   * ```ts
   * const col = collect([1, 2, 3]);
   * for (const _ of col) { break; } // exits after first item
   * col.processed(); // 1
   * ```
   */
  processed(): number {
    return this._processed;
  }

  // ─── Iteration ────────────────────────────────────────────────────────────

  /**
   * Iterates lazily over elements from the source iterable.
   *
   * Implements the `Iterable<T>` protocol. Each call creates a fresh
   * generator that wraps the source — the source itself is iterated
   * once per call. One-shot generators (e.g. the result of a generator
   * function) can only be consumed once; passing the same generator
   * instance to a second `for...of` will yield nothing.
   *
   * Updates `_current` and `_processed` with each yielded item.
   *
   * @yields Each element `T` in the order produced by the source.
   *
   * @example
   * ```ts
   * const col = collect(new Set([100, 200, 300]));
   *
   * for (const item of col) {
   *   console.log(item); // 100, 200, 300
   * }
   * ```
   */
  *[Symbol.iterator](): Generator<T, void, unknown> {
    try {
      for (const item of this.source) {
        this._current = item;
        yield item;
        this._processed++;
      }
    } catch (err) {
      throw err;
    }
  }

  // ─── Introspection ────────────────────────────────────────────────────────

  /**
   * Returns a human-readable label for logging and assertion messages.
   *
   * Format: `"[NodeCollections::LazyCollection (Pulled: {n})]"`.
   *
   * @returns The string label.
   *
   * @example
   * ```ts
   * const col = collect(new Set([1, 2, 3]));
   * col.toString();
   * // "[NodeCollections::LazyCollection (Pulled: 0)]"
   * ```
   */
  toString(): string {
    return `[NodeCollections::${this.constructor.name} (Pulled: ${this._processed})]`;
  }

  /**
   * Custom Node.js `util.inspect` formatter.
   *
   * Called by `console.log`, `util.inspect`, and the Node.js REPL.
   * Reports how many items have been pulled so far without triggering
   * further evaluation.
   *
   * @returns A formatted inspection string.
   *
   * @example
   * ```ts
   * console.log(collect(new Set([1, 2, 3])));
   * // LazyCollection { [Status: Pulled 0 items] }
   * ```
   */
  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `${this.constructor.name} { [Status: Pulled ${this._processed} items] }`;
  }
}
