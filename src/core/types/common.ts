/**
 * Represents a class constructor that can be instantiated with `new`.
 * * Used primarily for dependency injection and factory patterns within
 * the collection engines.
 * * @template T - The instance type that the constructor produces.
 */
export type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Extracts only the keys of a type `T` that correspond to methods (functions).
 * * This is useful for building proxy objects or decorators that only
 * target class methods while ignoring properties.
 * * @template T - The source type to extract method names from.
 * * @example
 * ```ts
 * class User { id: number; save() {} }
 * type UserMethods = MethodOf<User>; // "save"
 * ```
 */
export type MethodOf<T> = {
  [K in keyof T]: T[K] extends (...args: never[]) => unknown ? K : never;
}[keyof T];

/**
 * Extracts the parameter types of a function as a tuple.
 * * Commonly used to forward arguments from one function to another
 * while maintaining strict type safety.
 * * @template T - The function type to inspect.
 */
export type FnParams<T> = T extends (...args: infer P) => unknown ? P : never;

/**
 * Extracts the return type of a function.
 * * Similar to TypeScript's built-in `ReturnType`, but often used in
 * custom mapped types within the operator registry.
 * * @template T - The function type to inspect.
 */
export type FnReturn<T> = T extends (...args: never[]) => infer R ? R : never;

/**
 * Unwraps the underlying value type from an `Iterable` or `AsyncIterable`.
 * * This is the "secret sauce" for the collection engines, allowing the
 * system to know that an `AsyncIterable<User>` contains `User` objects.
 * * @template T - The iterable or async iterable to unwrap.
 * * @example
 * ```ts
 * type Item = Unwrap<string[]>; // string
 * type AsyncItem = Unwrap<AsyncIterable<number>>; // number
 * ```
 */
export type Unwrap<T> = T extends Iterable<infer U> ? U : T extends AsyncIterable<infer V> ? V : T;
