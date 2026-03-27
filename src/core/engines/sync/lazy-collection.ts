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
  protected _processed = 0;
  protected _current: T | undefined;
  protected _total: number | null = null;
  /**
   * Create a new LazyCollection wrapping the given iterable.
   * The source is not consumed on construction —
   * evaluation defers until iteration begins.
   *
   * @param   source  Any `Iterable<T>` to wrap.
   */
  constructor(protected source: Iterable<T>) {}

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
    const result = Array.from(this.source);
    this._processed += result.length;
    this._total = this._processed;
    return result;
  }

  current(): T | undefined {
    return this._current;
  }

  count(): number {
    return this.total();
  }

  total(): number {
    if (this._total !== null) return this._total;

    if (Array.isArray(this.source)) return this.source.length;
    if (this.source instanceof Set || this.source instanceof Map) return this.source.size;
    let count = 0;
    for (const _ of this.source) {
      count++;
    }
    this._total = count;
    return count;
  }

  processed(): number {
    return this._processed;
  }

  remaining(): number | null {
    return this.total() - this.processed();
  }

  progress(): number {
    const total = this.total();
    if (!total || total === 0) return 0;

    return Math.round((this._processed / total) * 100);
  }

  toArray(): T[] {
    return this.all();
  }

  toJSON(): T[] {
    return this.all();
  }

  toString(): string {
    return `[NodeCollections::${this.constructor.name} (Pulled: ${this._processed})]`;
  }

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
    try {
      for (const item of this.source) {
        this._current = item;
        yield item;
        this._processed++;
      }
    } catch (err) {
      throw err;
    } finally {
    }
  }

  [Symbol.for('nodejs.util.inspect.custom')]() {
    const label = this.constructor.name;
    return `${label} { [Status: Pulled ${this._processed} items] }`;
  }
}
