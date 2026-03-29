import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';
import { ComparisonOperator, register } from '../types';

/**
 * Internal comparison engine with strict operator typing.
 * Handles Laravel-style polymorphic arguments.
 */
function compare(itemValue: any, operator: ComparisonOperator | any, value?: any): boolean {
  // Logic: If 'value' is undefined, the 2nd arg is the 'target value' (default to ===)
  const isDirectMatch = value === undefined;
  const actualValue = isDirectMatch ? operator : value;
  const actualOperator: ComparisonOperator = isDirectMatch ? '===' : operator;

  switch (actualOperator) {
    case '===':
    case '==':
      return itemValue === actualValue;
    case '!==':
    case '!=':
      return itemValue !== actualValue;
    case '>':
      return itemValue > actualValue;
    case '<':
      return itemValue < actualValue;
    case '>=':
      return itemValue >= actualValue;
    case '<=':
      return itemValue <= actualValue;
    case 'contains':
      return Array.isArray(itemValue) ? itemValue.includes(actualValue) : false;
    default:
      // Fallback for safety, though TS should prevent this
      return itemValue === actualValue;
  }
}

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /**
     * Filter the collection by a given key / value pair (Strict Equality).
     * * @param key - The property name to filter by.
     * @param value - The expected value to match.
     * @returns A new collection containing only matching elements.
     * * @example
     * ```ts
     * collect(users).where('active', true);
     * ```
     */
    where<K extends keyof T>(key: K, value: T[K]): Collection<T>;
    /**
     * Filter the collection using a custom comparison operator.
     * * @param key - The property name to filter by.
     * @param operator - Valid comparison operator: '==', '===', '!=', '!==', '>', '<', '>=', '<=', 'contains'.
     * @param value - The value to compare against.
     * @returns A new collection containing only matching elements.
     * * @example
     * ```ts
     * collect(products).where('price', '>', 100);
     * ```
     */
    where<K extends keyof T>(key: K, operator: ComparisonOperator, value: any): Collection<T>;
  }

  interface LazyEnumerableMethods<T> {
    /**
     * Filter the collection lazily by a given key / value pair.
     * * **Short-circuiting:** Comparison happens only when items are pulled.
     */
    where<K extends keyof T>(key: K, value: T[K]): LazyCollection<T>;
    where<K extends keyof T>(key: K, operator: ComparisonOperator, value: any): LazyCollection<T>;
  }

  interface AsyncEnumerableMethods<T> {
    /**
     * Filter the asynchronous collection by a given key / value pair.
     * * Waits for the data to resolve before applying the filter logic.
     */
    where<K extends keyof T>(key: K, value: T[K]): AsyncCollection<T>;
    where<K extends keyof T>(key: K, operator: ComparisonOperator, value: any): AsyncCollection<T>;
  }

  interface AsyncLazyEnumerableMethods<T> {
    /**
     * Filter the asynchronous stream by a given key / value pair.
     * * **Memory Efficient:** Compares items one-by-one as they flow from the source.
     */
    where<K extends keyof T>(key: K, value: T[K]): AsyncLazyCollection<T>;
    where<K extends keyof T>(key: K, operator: ComparisonOperator, value: any): AsyncLazyCollection<T>;
  }
}

// ============================================================================
// LOGIC IMPLEMENTATIONS
// ============================================================================

const eagerSync = <T>(ctx: Collection<T>, key: keyof T, op: any, val?: any) => {
  return new Collection(ctx.all().filter((item) => compare(item[key], op, val)));
};

const lazySync = <T>(ctx: LazyCollection<T>, key: keyof T, op: any, val?: any) => {
  return new LazyCollection(
    (function* () {
      for (const item of ctx) {
        if (compare(item[key], op, val)) yield item;
      }
    })(),
  );
};

const eagerAsync = <T>(ctx: AsyncCollection<T>, key: keyof T, op: any, val?: any) => {
  return new AsyncCollection(ctx.all().then((items) => items.filter((item) => compare(item[key], op, val))));
};

const lazyAsync = <T>(ctx: AsyncLazyCollection<T>, key: keyof T, op: any, val?: any) => {
  return new AsyncLazyCollection(
    (async function* () {
      for await (const item of ctx) {
        if (compare(item[key], op, val)) yield item;
      }
    })(),
  );
};

// ============================================================================
// REGISTRATION
// ============================================================================

defineOperator('where', [
  register(Collection, eagerSync),
  register(LazyCollection, lazySync),
  register(AsyncCollection, eagerAsync),
  register(AsyncLazyCollection, lazyAsync),
]);
