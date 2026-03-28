/**
 * Marker interface shared by every collection engine.
 *
 * Provides the canonical string representation used in logging,
 * debugging, and Node.js inspect output. All four engines
 * — `Collection`, `LazyCollection`, `AsyncCollection`,
 * and `AsyncLazyCollection` — extend this interface.
 *
 * @typeParam T - The element type held by the collection.
 *
 * @category Contract
 */
export interface BaseEnumerable<T> {
  /**
   * Returns a human-readable label identifying the engine,
   * current cursor position, and total element count.
   *
   * The format mirrors Laravel's `Collection::__toString()` style
   * and is safe to use in log output or assertion messages.
   *
   * @returns A string in the form
   *   `"[NodeCollections::{ClassName} ({processed}/{total} processed)]"`.
   *
   * @example
   * ```ts
   * const col = new Collection([1, 2, 3]);
   * console.log(col.toString());
   * // "[NodeCollections::Collection (0/3 processed)]"
   *
   * for (const _ of col) { }
   * console.log(col.toString());
   * // "[NodeCollections::Collection (3/3 processed)]"
   * ```
   */
  toString(): string;
}

// ─── Operator extension surfaces ──────────────────────────────────────────────

/**
 * Extension surface for operators targeting the eager synchronous engine.
 *
 * This interface is intentionally empty at the library level.
 * Plugin authors augment it via TypeScript module augmentation
 * to declare methods that `defineOperator` injects onto
 * `Collection`'s prototype at runtime.
 *
 * @typeParam T - The element type of the collection being extended.
 *
 * @example
 * ```ts
 * // In your plugin — my-plugin/map.ts
 * declare module '@node-collections/core/contracts/enumerable' {
 *   interface EnumerableMethods<T> {
 *     /**
 *      * Transforms each element using the given mapping function.
 *      *
 *      * @param fn - A function that maps `T` to `U`.
 *      * @returns A new `Collection` of type `U`.
 *      *\/
 *     map<U>(fn: (item: T) => U): Collection<U>;
 *   }
 * }
 * ```
 *
 * @see `defineOperator`
 * @see `Collection`
 * @category Contract
 */
export interface EnumerableMethods<T> {}

/**
 * Extension surface for operators targeting the lazy synchronous engine.
 *
 * Plugin authors augment this interface to declare methods injected
 * onto `LazyCollection`'s prototype. Operators registered here
 * should return a new `LazyCollection` to preserve deferred evaluation.
 *
 * @typeParam T - The element type of the lazy collection being extended.
 *
 * @example
 * ```ts
 * declare module '@node-collections/core/contracts/enumerable' {
 *   interface LazyEnumerableMethods<T> {
 *     /**
 *      * Lazily transforms each element via a generator.
 *      * No transformation occurs until the collection is iterated.
 *      *
 *      * @param fn - A function that maps `T` to `U`.
 *      * @returns A new deferred `LazyCollection` of type `U`.
 *      *\/
 *     map<U>(fn: (item: T) => U): LazyCollection<U>;
 *   }
 * }
 * ```
 *
 * @see `defineOperator`
 * @see `LazyCollection`
 * @category Contract
 */
export interface LazyEnumerableMethods<T> {}

/**
 * Extension surface for operators targeting the eager asynchronous engine.
 *
 * Plugin authors augment this interface to declare methods injected
 * onto `AsyncCollection`'s prototype. Operators here typically
 * accept `fn: (item: T) => U | Promise<U>` to support both sync
 * and async transformations.
 *
 * @typeParam T - The element type of the async collection being extended.
 *
 * @example
 * ```ts
 * declare module '@node-collections/core/contracts/enumerable' {
 *   interface AsyncEnumerableMethods<T> {
 *     /**
 *      * Concurrently transforms all resolved items.
 *      *
 *      * @param fn - A sync or async mapping function.
 *      * @returns A new `AsyncCollection` of type `U`.
 *      *\/
 *     map<U>(fn: (item: T) => U | Promise<U>): AsyncCollection<U>;
 *   }
 * }
 * ```
 *
 * @see `defineOperator`
 * @see `AsyncCollection`
 * @category Contract
 */
export interface AsyncEnumerableMethods<T> {}

/**
 * Extension surface for operators targeting the lazy asynchronous engine.
 *
 * Plugin authors augment this interface to declare methods injected
 * onto `AsyncLazyCollection`'s prototype. Operators here compose
 * async generators — no evaluation happens until iteration begins.
 *
 * @typeParam T - The element type of the async lazy collection being extended.
 *
 * @example
 * ```ts
 * declare module '@node-collections/core/contracts/enumerable' {
 *   interface AsyncLazyEnumerableMethods<T> {
 *     /**
 *      * Lazily transforms each item as it is pulled from the source.
 *      * Evaluation is deferred until `for await...of` or `.all()`.
 *      *
 *      * @param fn - A sync or async mapping function.
 *      * @returns A new deferred `AsyncLazyCollection` of type `U`.
 *      *\/
 *     map<U>(fn: (item: T) => U | Promise<U>): AsyncLazyCollection<U>;
 *   }
 * }
 * ```
 *
 * @see `defineOperator`
 * @see `AsyncLazyCollection`
 * @category Contract
 */
export interface AsyncLazyEnumerableMethods<T> {}

// ─── Core contracts ────────────────────────────────────────────────────────────

/**
 * Base contract for all **synchronous** collection engines.
 *
 * Extends the native `Iterable<T>` protocol, making every
 * synchronous collection compatible with `for...of`, spread (`[...col]`),
 * `Array.from()`, and destructuring out of the box.
 *
 * The methods defined here are **terminal** — they materialise elements
 * and return plain values rather than new collection instances.
 * Transformation operators (`map`, `filter`, etc.) live on
 * `EnumerableMethods` and `LazyEnumerableMethods`.
 *
 * @typeParam T - The type of elements held by the collection.
 *
 * @see `Collection`
 * @see `LazyCollection`
 * @category Contract
 */
export interface Enumerable<T> extends Iterable<T>, BaseEnumerable<T> {
  /**
   * Materialises all elements into a plain JavaScript array.
   *
   * For eager collections this returns a shallow copy of the internal
   * buffer. For lazy collections this triggers full generator evaluation.
   * The returned array is always a new allocation — mutations do not
   * affect the source collection.
   *
   * @returns A new `T[]` containing all elements in insertion order.
   *
   * @example
   * ```ts
   * const items = collect([10, 20, 30]).all();
   * // [10, 20, 30]
   * ```
   */
  all(): T[];

  /**
   * Serialises the collection to a plain array for `JSON.stringify`.
   *
   * Called automatically by `JSON.stringify`. Delegates to `all`,
   * so the output is identical — a new `T[]` in insertion order.
   *
   * @returns A new `T[]` suitable for JSON serialisation.
   *
   * @example
   * ```ts
   * const json = JSON.stringify(collect([1, 2, 3]));
   * // '[1,2,3]'
   * ```
   */
  toJSON(): T[];

  /**
   * Alias for `all`.
   *
   * Provided for API symmetry with the async engines, where
   * `toArray()` is the idiomatic way to drain an async iterable
   * into a plain array.
   *
   * @returns A new `T[]` containing all elements.
   *
   * @example
   * ```ts
   * const arr = collect(new Set([1, 2, 3])).toArray();
   * // [1, 2, 3]
   * ```
   */
  toArray(): T[];

  /**
   * Returns the total number of elements in the collection.
   *
   * For eager collections this is an O(1) property access.
   * For lazy collections backed by a generator, a full traversal
   * may occur the first time this is called. The result is cached
   * so subsequent calls remain O(1).
   *
   * @returns The element count as a number.
   *
   * @example
   * ```ts
   * collect([1, 2, 3]).count(); // 3
   * collect(new Set([1, 2])).count(); // 2
   * ```
   */
  count(): number;

  /**
   * Returns the element at the current iterator cursor position.
   *
   * The cursor advances with each yielded item during a `for...of`
   * loop. Calling `current()` outside of iteration returns the last
   * item that was yielded, or `undefined` if iteration has not started.
   *
   * @returns The current element, or `undefined` before the first yield.
   *
   * @example
   * ```ts
   * const col = collect([10, 20, 30]);
   *
   * for (const item of col) {
   *   console.log(col.current()); // 10, then 20, then 30
   * }
   * ```
   */
  current(): T | undefined;

  /**
   * Returns the total number of elements in the collection.
   *
   * Identical to `count` — both exist for API symmetry with
   * the async engines. Use `count` when semantics are about
   * "how many items", and `total()` when semantics are about
   * "out of how many items total".
   *
   * @returns The total element count.
   *
   * @example
   * ```ts
   * const col = collect([1, 2, 3, 4, 5]);
   * col.total(); // 5
   * ```
   */
  total(): number;

  /**
   * Returns the number of elements not yet consumed by the current pass.
   *
   * Calculated as `total() - cursor`. Meaningful during active `for...of`
   * iteration; after a full pass it returns `0`. For lazy collections
   * backed by an infinite generator, this may return `null` if the
   * total is not yet determinable.
   *
   * @returns Remaining element count, or `null` if total is unknown.
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
  remaining(): number | null;

  /**
   * Returns the percentage of elements yielded in the current pass (0–100).
   *
   * Calculated as `Math.round((cursor / total) * 100)`. Useful for
   * rendering progress bars or logging pipeline throughput.
   * Returns `0` when total is `0` or unknown.
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
  progress(): number;
}

/**
 * Base contract for all **asynchronous** collection engines.
 *
 * Extends the native `AsyncIterable<T>` protocol, enabling `for await...of`
 * loops, `Symbol.asyncIterator`, and async spread patterns.
 *
 * All terminal methods return Promises. Settlement-tracking methods
 * (`resolved`, `rejected`, `errors`) are **synchronous** — they reflect
 * the state accumulated so far and are safe to call mid-iteration.
 *
 * @typeParam T - The resolved value type held by the collection.
 *
 * @see `AsyncCollection`
 * @see `AsyncLazyCollection`
 * @category Contract
 */
export interface AsyncEnumerable<T> extends AsyncIterable<T>, BaseEnumerable<T> {
  /**
   * Resolves and materialises all fulfilled items into a plain array.
   *
   * For eager collections, this triggers `Promise.allSettled` on the
   * internal promise array. For lazy collections, this drains the async
   * iterable. Rejected promises are silently collected in `errors`;
   * only fulfilled values are included in the result.
   *
   * The result is cached after the first call — safe to `await` multiple times.
   *
   * @returns A `Promise<T[]>` resolving to all fulfilled values in input order.
   *
   * @example
   * ```ts
   * const users = await collect([
   *   fetchUser(1),
   *   fetchUser(2),
   *   Promise.reject(new Error('not found')),
   * ]).all();
   *
   * // users = [User, User]  — the rejection is captured in errors()
   * ```
   */
  all(): Promise<T[]>;

  /**
   * Alias for `all`. Used by `JSON.stringify` for async serialisation.
   *
   * @returns A `Promise<T[]>` of all fulfilled values.
   *
   * @example
   * ```ts
   * const json = JSON.stringify(await collect([p1, p2]).toJSON());
   * ```
   */
  toJSON(): Promise<T[]>;

  /**
   * Alias for `all`. Drains the async iterable into a plain array.
   *
   * @returns A `Promise<T[]>` of all fulfilled values.
   *
   * @example
   * ```ts
   * const arr = await collect(asyncGenerator()).toArray();
   * ```
   */
  toArray(): Promise<T[]>;

  /**
   * Returns the count of fulfilled items.
   *
   * Triggers settlement if the collection has not yet been resolved.
   *
   * @returns A `Promise<number>` resolving to the fulfilled item count.
   *
   * @example
   * ```ts
   * const n = await collect([fetchUser(1), fetchUser(2)]).count();
   * // 2
   * ```
   */
  count(): Promise<number>;

  /**
   * Returns the item at the current iterator cursor position.
   *
   * Safe to call mid `for await...of` loop to inspect the most recently
   * yielded item. Returns `undefined` before iteration begins.
   *
   * @returns A `Promise<T>` resolving to the current item.
   *
   * @example
   * ```ts
   * const col = collect([fetchUser(1), fetchUser(2)]);
   *
   * for await (const user of col) {
   *   const same = await col.current();
   *   console.log(same === user); // true
   * }
   * ```
   */
  current(): Promise<T>;

  /**
   * Returns the total number of inputs (fulfilled + rejected).
   *
   * For eager collections backed by `Promise<T>[]`, this is known
   * synchronously from construction and resolves immediately.
   * For lazy collections backed by an async generator, this requires
   * a full drain of the source.
   *
   * @returns A `Promise<number>` resolving to the total input count.
   *
   * @example
   * ```ts
   * const col = collect([p1, p2, p3]);
   * const total = await col.total(); // 3
   * ```
   */
  total(): Promise<number>;

  /**
   * Returns the number of items not yet yielded by the current pass.
   *
   * For lazy collections whose total is not yet known, returns `0`
   * rather than draining the source implicitly. Call `total` first
   * if you need an accurate figure before iteration.
   *
   * @returns A `Promise<number>` resolving to the remaining item count.
   *
   * @example
   * ```ts
   * const col = collect([p1, p2, p3, p4]);
   * await col.all();
   *
   * let count = 0;
   * for await (const _ of col) {
   *   count++;
   *   if (count === 2) {
   *     console.log(await col.remaining()); // 2
   *   }
   * }
   * ```
   */
  remaining(): Promise<number>;

  /**
   * Returns the percentage of items yielded in the current pass (0–100).
   *
   * Calculated as `Math.round((cursor / total) * 100)`.
   * Returns `0` when the total is unknown or zero.
   *
   * @returns A `Promise<number>` resolving to an integer between `0` and `100`.
   *
   * @example
   * ```ts
   * const col = collect([p1, p2, p3, p4]);
   * let i = 0;
   *
   * for await (const _ of col) {
   *   if (++i === 2) console.log(await col.progress()); // 50
   * }
   * ```
   */
  progress(): Promise<number>;

  /**
   * Returns the count of Promises that have fulfilled.
   *
   * This is a **synchronous** method — it reflects the settlement
   * state accumulated so far without triggering further resolution.
   *
   * @remarks The method name preserves an intentional typo from the
   * original contract. Use alongside `rejected` and `errors`
   * to implement retry or error-reporting logic.
   *
   * @returns The number of fulfilled Promises as a plain number.
   *
   * @example
   * ```ts
   * const col = collect([Promise.resolve(1), Promise.reject(new Error('x'))]);
   * await col.all();
   *
   * col.resolved(); // 1
   * col.rejected();  // 1
   * ```
   */
  resolved(): number;

  /**
   * Returns the count of Promises that have rejected.
   *
   * Synchronous — safe to call at any point after resolution begins.
   * Pairs with `errors` to retrieve the actual failure reasons.
   *
   * @returns The number of rejected Promises as a plain number.
   *
   * @example
   * ```ts
   * const col = collect([
   *   Promise.resolve('ok'),
   *   Promise.reject(new Error('timeout')),
   * ]);
   * await col.all();
   *
   * col.rejected(); // 1
   * col.errors();   // [Error: timeout]
   * ```
   */
  rejected(): number;

  /**
   * Returns all errors collected from rejected Promises.
   *
   * Synchronous — returns a shallow copy of the internal error buffer.
   * Mutations to the returned array do not affect the collection's
   * internal state. The array is ordered by input position.
   *
   * @returns A `Error[]` shallow copy of accumulated rejection errors.
   *
   * @example
   * ```ts
   * const col = collect([
   *   fetchUser(1),
   *   Promise.reject(new Error('404 Not Found')),
   *   Promise.reject(new Error('503 Unavailable')),
   * ]);
   * await col.all();
   *
   * col.errors().forEach(err => console.error(err.message));
   * // "404 Not Found"
   * // "503 Unavailable"
   * ```
   */
  errors(): Error[];
}
