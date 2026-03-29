import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';
import { register } from '../types';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /**
     * Retrieve all of the values for a given key from the collection.
     * * This method is ideal for extracting a single column or property from
     * a collection of objects into a flat collection of values.
     *
     * @template K - A valid key (property name) of the objects in the collection.
     * @param key - The name of the property to retrieve.
     * @returns A new collection containing only the values of the specified key.
     *
     * @example
     * ```ts
     * const users = collect([{ id: 1, name: 'Adi' }, { id: 2, name: 'Budi' }]);
     * const names = users.pluck('name'); // ['Adi', 'Budi']
     * ```
     */
    pluck<K extends keyof T>(key: K): Collection<T[K]>;
  }

  interface LazyEnumerableMethods<T> {
    /**
     * Retrieve values for a given key lazily.
     * * The extraction is deferred until the collection is iterated. This
     * is highly efficient when you only need to pluck properties from
     * a subset of a massive dataset.
     *
     * @template K - The key to pluck from each yielded object.
     * @param key - The property name to extract.
     * @returns A new lazy collection yielding the plucked values.
     */
    pluck<K extends keyof T>(key: K): LazyCollection<T[K]>;
  }

  interface AsyncEnumerableMethods<T> {
    /**
     * Retrieve values for a given key from an asynchronous collection.
     * * This method waits for the underlying data promise to resolve,
     * then extracts the specified property from every object in the list.
     *
     * @template K - The key to pluck from the awaited objects.
     * @param key - The property name to extract.
     * @returns An async collection resolving to a list of plucked values.
     */
    pluck<K extends keyof T>(key: K): AsyncCollection<T[K]>;
  }

  interface AsyncLazyEnumerableMethods<T> {
    /**
     * Extract a specific property from each item in an asynchronous stream.
     * * Perfect for processing large streams of objects (e.g., from a database
     * cursor) where you only need one specific field, keeping memory usage
     * at a minimum.
     *
     * @template K - The key to pluck from each async-yielded object.
     * @param key - The property name to extract.
     * @returns A lazy async collection yielding plucked results sequentially.
     */
    pluck<K extends keyof T>(key: K): AsyncLazyCollection<T[K]>;
  }
}

// ============================================================================
// LOGIC IMPLEMENTATIONS
// ============================================================================

const eagerSync = <T, K extends keyof T>(ctx: Collection<T>, key: K): Collection<T[K]> => {
  return new Collection(ctx.all().map((item) => item[key]));
};

const lazySync = <T, K extends keyof T>(ctx: LazyCollection<T>, key: K): LazyCollection<T[K]> => {
  return new LazyCollection(
    (function* () {
      for (const item of ctx) yield item[key];
    })(),
  );
};

const eagerAsync = <T, K extends keyof T>(ctx: AsyncCollection<T>, key: K): AsyncCollection<T[K]> => {
  return new AsyncCollection(ctx.all().then((items) => items.map((item) => item[key])));
};

const lazyAsync = <T, K extends keyof T>(ctx: AsyncLazyCollection<T>, key: K): AsyncLazyCollection<T[K]> => {
  return new AsyncLazyCollection(
    (async function* () {
      for await (const item of ctx) yield item[key];
    })(),
  );
};

// ============================================================================
// REGISTRATION
// ============================================================================

defineOperator('pluck', [
  register(Collection, eagerSync),
  register(LazyCollection, lazySync),
  register(AsyncCollection, eagerAsync),
  register(AsyncLazyCollection, lazyAsync),
]);
