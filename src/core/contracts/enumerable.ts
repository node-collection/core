/**
 * Methods common to all synchronous collections.
 */
export interface EnumerableMethods<T> {}

/**
 * Methods common to all lazy synchronous collections.
 */
export interface LazyEnumerableMethods<T> {}

/**
 * Methods common to all eager asynchronous collections.
 */
export interface AsyncEnumerableMethods<T> {}

/**
 * Methods common to all lazy asynchronous collections.
 */
export interface AsyncLazyEnumerableMethods<T> {}

/**
 * The base interface for synchronous collections.
 */
export interface Enumerable<T> extends Iterable<T> {
  all(): T[];
}

/**
 * The base interface for asynchronous collections.
 */
export interface AsyncEnumerable<T> extends AsyncIterable<T> {
  all(): Promise<T[]>;
}
