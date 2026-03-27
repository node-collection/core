import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /** 🟢 Sync Eager: Ambil satu properti dari tiap object */
    pluck<K extends keyof T>(key: K): Collection<T[K]>;
  }
  interface LazyEnumerableMethods<T> {
    /** 🟡 Sync Lazy: Pluck via Generator */
    pluck<K extends keyof T>(key: K): LazyCollection<T[K]>;
  }
  interface AsyncEnumerableMethods<T> {
    /** 🔵 Async Eager: Pluck dari list of Promises */
    pluck<K extends keyof T>(key: K): AsyncCollection<T[K]>;
  }
  interface AsyncLazyEnumerableMethods<T> {
    /** 🟣 Async Lazy: Pluck dari Stream */
    pluck<K extends keyof T>(key: K): AsyncLazyCollection<T[K]>;
  }
}

/** 🟢 1. Sync Eager */
defineOperator('pluck', Collection, function <T, K extends keyof T>(ctx: Collection<T>, key: K) {
  return new Collection(ctx.all().map((item) => item[key]));
});

/** 🟡 2. Sync Lazy */
defineOperator('pluck', LazyCollection, function <T, K extends keyof T>(ctx: LazyCollection<T>, key: K) {
  return new LazyCollection(
    (function* () {
      for (const item of ctx) yield item[key];
    })(),
  );
});

/** 🔵 3. Async Eager */
defineOperator('pluck', AsyncCollection, function <T, K extends keyof T>(ctx: AsyncCollection<T>, key: K) {
  return new AsyncCollection(ctx.all().then((items) => items.map((item) => item[key])));
});

/** 🟣 4. Async Lazy */
defineOperator('pluck', AsyncLazyCollection, function <T, K extends keyof T>(ctx: AsyncLazyCollection<T>, key: K) {
  return new AsyncLazyCollection(
    (async function* () {
      for await (const item of ctx) yield item[key];
    })(),
  );
});
