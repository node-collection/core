import { Enumerable, EnumerableMethods } from '@/core/contracts/enumerable';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface Collection<T> extends Enumerable<T>, EnumerableMethods<T> {}

/**
 * An eager, synchronous collection backed by a plain JavaScript array.
 *
 * Every operator registered via `defineOperator` on this engine evaluates
 * immediately — each step materialises its result into a new array before
 * the next step begins. This makes `Collection` the most predictable engine:
 * stack traces are simple, memory usage is proportional to element count,
 * and you can inspect intermediate results at any point.
 *
 * Choose `Collection` when:
 * - Your dataset fits comfortably in memory.
 * - You need random access or multiple full passes over the data.
 * - You are chaining many small, cheap transformations.
 *
 * For memory-constrained pipelines over large or infinite sequences,
 * prefer `LazyCollection`. For datasets backed by Promises or async
 * generators, see `AsyncCollection` and `AsyncLazyCollection`.
 *
 * @typeParam T - The type of elements held by this collection.
 *
 * @see `collect` — preferred factory function
 * @see `LazyCollection` — deferred sync alternative
 *
 * @example
 * ```ts
 * const result = collect([1, 2, 3, 4, 5])
 *   .filter(n => n % 2 === 0)
 *   .map(n => n * 10)
 *   .all();
 * // [20, 40]
 * ```
 *
 * @category Engine
 */
export class Collection<T> {
  /**
   * Internal iterator cursor. Advanced by one for each item yielded
   * during a `for...of` loop. Reset to `0` at the start of each pass.
   *
   * @internal
   */
  protected _cursor = 0;

  /**
   * Creates a new `Collection` wrapping the given array.
   *
   * The source array is stored by reference — it is never cloned on
   * construction. A safe shallow copy is produced only when you call
   * `all`, `toArray`, or `toJSON`.
   *
   * @param items - The source `T[]` to wrap.
   *
   * @example
   * ```ts
   * const col = new Collection([1, 2, 3]);
   * // or via the factory:
   * const col = collect([1, 2, 3]);
   * ```
   */
  constructor(protected items: T[]) {}

  // ─── Terminal methods ─────────────────────────────────────────────────────

  /**
   * Materialises all elements into a new plain array.
   *
   * Returns a **shallow copy** of the internal buffer — mutations to
   * the returned array do not affect the source collection or any
   * subsequent operator calls. This is the primary way to exit the
   * collection pipeline and retrieve a standard JavaScript array.
   *
   * @returns A new `T[]` containing every element in insertion order.
   *
   * @example
   * ```ts
   * const items = collect([1, 2, 3]).all();
   * // [1, 2, 3]
   *
   * items.push(99); // safe — does not mutate the collection
   * ```
   */
  all(): T[] {
    try {
      return [...this.items];
    } catch (err) {
      throw err;
    }
  }

  /**
   * Alias for `all`. Drains the collection into a plain array.
   *
   * Provided for API symmetry with `AsyncCollection` and
   * `AsyncLazyCollection`, where `toArray()` is the idiomatic
   * way to materialise items from an async pipeline.
   *
   * @returns A new `T[]` containing every element.
   *
   * @example
   * ```ts
   * const arr = collect(new Set([1, 2, 3])).toArray();
   * // [1, 2, 3]
   * ```
   */
  toArray(): T[] {
    return this.all();
  }

  /**
   * Serialises the collection to a plain array for `JSON.stringify`.
   *
   * Called automatically by `JSON.stringify` — you rarely need to call
   * this directly. The result is identical to `all`: a new shallow
   * copy of the internal element buffer.
   *
   * @returns A new `T[]` in insertion order.
   *
   * @example
   * ```ts
   * const json = JSON.stringify(collect([{ id: 1 }, { id: 2 }]));
   * // '[{"id":1},{"id":2}]'
   * ```
   */
  toJSON(): T[] {
    return this.all();
  }

  // ─── Quantifiers ─────────────────────────────────────────────────────────

  /**
   * Returns the total number of elements in the collection.
   *
   * Delegates to `total`. Both methods exist for API expressiveness:
   * use `count()` when the semantic intent is "how many items are there",
   * and `total()` when the intent is "out of how many items total".
   *
   * This is an O(1) operation — the length is read directly from
   * the internal array.
   *
   * @returns The element count as a plain number.
   *
   * @example
   * ```ts
   * collect(['a', 'b', 'c']).count(); // 3
   * ```
   */
  count(): number {
    return this.total();
  }

  /**
   * Returns the total number of elements in the collection.
   *
   * O(1) — reads directly from the internal array's `length` property.
   * Does not trigger any traversal or materialisation.
   *
   * @returns The element count as a plain number.
   *
   * @example
   * ```ts
   * const col = collect([10, 20, 30, 40]);
   * col.total(); // 4
   * ```
   */
  total(): number {
    return this.items.length;
  }

  /**
   * Returns the element at the current iterator cursor position.
   *
   * The cursor is advanced by the `[Symbol.iterator]` generator.
   * Calling `current()` outside of a `for...of` loop returns the item
   * at index `0`, or `undefined` if the collection is empty.
   *
   * @returns The element at the current cursor, or `undefined`.
   *
   * @example
   * ```ts
   * const col = collect(['x', 'y', 'z']);
   *
   * for (const item of col) {
   *   console.log(col.current()); // 'x', then 'y', then 'z'
   * }
   * ```
   */
  current(): T | undefined {
    return this.items[this._cursor];
  }

  /**
   * Returns the number of elements not yet consumed by the current pass.
   *
   * Calculated as `total() - cursor`. Decrements by one for each item
   * yielded during a `for...of` loop. Returns `total()` before the
   * first pass begins, and `0` after the pass completes.
   *
   * @returns The remaining element count as a plain number.
   *
   * @example
   * ```ts
   * const col = collect([1, 2, 3]);
   *
   * for (const _ of col) {
   *   console.log(col.remaining()); // 2, then 1, then 0
   * }
   * ```
   */
  remaining(): number {
    return this.total() - this._cursor;
  }

  /**
   * Returns the percentage of elements yielded in the current pass (0–100).
   *
   * Calculated as `Math.round((cursor / total) * 100)`. Suitable for
   * rendering progress bars, writing structured logs, or reporting
   * pipeline throughput during long-running sync transforms.
   *
   * Returns `0` when the collection is empty.
   *
   * @returns An integer between `0` and `100` inclusive.
   *
   * @example
   * ```ts
   * const col = collect([1, 2, 3, 4]);
   * let i = 0;
   *
   * for (const _ of col) {
   *   if (++i === 2) console.log(col.progress()); // 50
   * }
   * ```
   */
  progress(): number {
    const total = this.total();
    if (total === 0) return 0;
    return Math.round((this._cursor / total) * 100);
  }

  /**
   * Returns the number of elements that have been visited during
   * the current (or most recent) `for...of` pass.
   *
   * Alias for reading the internal `_cursor` value with a semantic name.
   * Resets to `0` at the start of each new iteration pass.
   *
   * @returns The cursor position as a plain number.
   *
   * @example
   * ```ts
   * const col = collect(['a', 'b', 'c']);
   * for (const _ of col) { break; }
   * col.processed(); // 1
   * ```
   */
  processed(): number {
    return this._cursor;
  }

  // ─── Iteration ────────────────────────────────────────────────────────────

  /**
   * Iterates over all elements in insertion order.
   *
   * Implements the `Iterable<T>` protocol, making `Collection` compatible
   * with `for...of`, spread syntax (`[...col]`), `Array.from()`, and
   * destructuring. The cursor resets to `0` at the start of each call,
   * so the collection is safely re-iterable any number of times.
   *
   * @yields Each element `T` in the order it was inserted.
   *
   * @example
   * ```ts
   * const col = collect([10, 20, 30]);
   *
   * for (const item of col) {
   *   console.log(item); // 10, 20, 30
   * }
   *
   * const spread = [...col]; // [10, 20, 30]
   * const [first, second] = col; // 10, 20
   * ```
   */
  *[Symbol.iterator](): Generator<T, void, unknown> {
    this._cursor = 0;
    try {
      for (const item of this.items) {
        yield item;
        this._cursor++;
      }
    } catch (err) {
      throw err;
    }
  }

  // ─── Introspection ────────────────────────────────────────────────────────

  /**
   * Returns a human-readable label for logging and assertion messages.
   *
   * Format: `"[NodeCollections::Collection ({processed}/{total} processed)]"`.
   *
   * @returns The string label.
   *
   * @example
   * ```ts
   * const col = collect([1, 2, 3]);
   * col.toString();
   * // "[NodeCollections::Collection (0/3 processed)]"
   * ```
   */
  toString(): string {
    return `[NodeCollections::${this.constructor.name} (${this.processed()}/${this.total()} processed)]`;
  }

  /**
   * Custom Node.js `util.inspect` formatter.
   *
   * Called by `console.log`, `util.inspect`, and the Node.js REPL.
   * Outputs the class name, cursor state, and a pretty-printed JSON
   * representation of the underlying array.
   *
   * @returns A formatted inspection string.
   *
   * @example
   * ```ts
   * console.log(collect([1, 2, 3]));
   * // Collection(3) [Cursor: 0] [
   * //   1,
   * //   2,
   * //   3
   * // ]
   * ```
   */
  [Symbol.for('nodejs.util.inspect.custom')]() {
    const data = this.all();
    const label = this.constructor.name;
    return `${label}(${this.total()}) [Cursor: ${this.processed()}] ${JSON.stringify(data, null, 2)}`;
  }
}
