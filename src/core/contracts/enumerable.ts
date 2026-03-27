export interface BaseEnumerable<T> {
  /** Representasi string: "[NodeCollections Collection]" */
  toString(): string;
}

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
export interface Enumerable<T> extends Iterable<T>, BaseEnumerable<T> {
  all(): T[];
  toJSON(): T[];
  toArray(): T[];
  count(): number;
  current(): T | undefined;
  total(): number;
  remaining(): number | null;
  progress(): number;
}

/**
 * The base interface for asynchronous collections.
 */
export interface AsyncEnumerable<T> extends AsyncIterable<T>, BaseEnumerable<T> {
  all(): Promise<T[]>;
  toJSON(): Promise<T[]>;
  toArray(): Promise<T[]>;
  count(): Promise<number>;
  current(): Promise<T>;
  total(): Promise<number>;
  remaining(): Promise<number>;
  progress(): Promise<number>;
  resoloved(): number;
  rejected(): number;
  errors(): Error[];
}
