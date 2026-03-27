import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';

/** 🛠️ Helper: Comparison Engine (Laravel Style) */
function compare(itemValue: any, operator: string, value?: any): boolean {
  const actualValue = value === undefined ? operator : value;
  const actualOperator = value === undefined ? '===' : operator;

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
      return itemValue === actualValue;
  }
}

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /** 🟢 Sync Eager: Filter berdasarkan key & value */
    where<K extends keyof T>(key: K, value: T[K]): Collection<T>;
    where<K extends keyof T>(key: K, operator: string, value: any): Collection<T>;
  }
  interface LazyEnumerableMethods<T> {
    /** 🟡 Sync Lazy: Filter via generator */
    where<K extends keyof T>(key: K, value: T[K]): LazyCollection<T>;
    where<K extends keyof T>(key: K, operator: string, value: any): LazyCollection<T>;
  }
  interface AsyncEnumerableMethods<T> {
    /** 🔵 Async Eager: Filter data async */
    where<K extends keyof T>(key: K, value: T[K]): AsyncCollection<T>;
    where<K extends keyof T>(key: K, operator: string, value: any): AsyncCollection<T>;
  }
  interface AsyncLazyEnumerableMethods<T> {
    /** 🟣 Async Lazy: Filter stream */
    where<K extends keyof T>(key: K, value: T[K]): AsyncLazyCollection<T>;
    where<K extends keyof T>(key: K, operator: string, value: any): AsyncLazyCollection<T>;
  }
}

/** 🟢 1. Sync Eager */
defineOperator('where', Collection, function <T>(ctx: Collection<T>, key: keyof T, op: any, val?: any) {
  return new Collection(ctx.all().filter((item) => compare(item[key], op, val)));
});

/** 🟡 2. Sync Lazy */
defineOperator('where', LazyCollection, function <T>(ctx: LazyCollection<T>, key: keyof T, op: any, val?: any) {
  return new LazyCollection(
    (function* () {
      for (const item of ctx) {
        if (compare(item[key], op, val)) yield item;
      }
    })(),
  );
});

/** 🔵 3. Async Eager */
defineOperator('where', AsyncCollection, function <T>(ctx: AsyncCollection<T>, key: keyof T, op: any, val?: any) {
  return new AsyncCollection(ctx.all().then((items) => items.filter((item) => compare(item[key], op, val))));
});

/** 🟣 4. Async Lazy */
defineOperator('where', AsyncLazyCollection, function <T>(ctx: AsyncLazyCollection<T>, key: keyof T, op: any, val?: any) {
  return new AsyncLazyCollection(
    (async function* () {
      for await (const item of ctx) {
        if (compare(item[key], op, val)) yield item;
      }
    })(),
  );
});
