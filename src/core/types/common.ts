/**
 * Represents a class constructor.
 */
export type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Extract method names from a given type.
 */
export type MethodOf<T> = {
  [K in keyof T]: T[K] extends (...args: never[]) => unknown ? K : never;
}[keyof T];

/**
 * Extract parameter types from a function.
 */
export type FnParams<T> = T extends (...args: infer P) => unknown ? P : never;

/**
 * Extract return type from a function.
 */
export type FnReturn<T> = T extends (...args: never[]) => infer R ? R : never;

/**
 * Unwrap an Iterable or AsyncIterable to get the underlying type.
 */
export type Unwrap<T> = T extends Iterable<infer U> ? U : T extends AsyncIterable<infer V> ? V : T;
