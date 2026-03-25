import { defineOperator } from '@/core/define';
import { AsyncCollection } from '@/core/engines/async/async-collection';
import { AsyncLazyCollection } from '@/core/engines/async/async-lazy-collection';
import { Collection } from '@/core/engines/sync/collection';
import { LazyCollection } from '@/core/engines/sync/lazy-collection';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /** 🟢 Sync Eager — transform tiap item, hasilkan Collection baru */
    map<U>(fn: (item: T) => U): Collection<U>;
  }
  interface LazyEnumerableMethods<T> {
    /** 🟡 Sync Lazy — transform via generator, deferred hingga diiterasi */
    map<U>(fn: (item: T) => U): LazyCollection<U>;
  }
  interface AsyncEnumerableMethods<T> {
    /** 🔵 Async Eager — transform list of Promises secara concurrent */
    map<U>(fn: (item: T) => U | Promise<U>): AsyncCollection<U>;
  }
  interface AsyncLazyEnumerableMethods<T> {
    /** 🟣 Async Lazy — transform via async generator, deferred hingga diiterasi */
    map<U>(fn: (item: T) => U | Promise<U>): AsyncLazyCollection<U>;
  }
}

defineOperator('map', Collection, function <T, U>(ctx: Collection<T>, fn: (item: T) => U): Collection<U> {
  return new Collection(ctx.all().map(fn));
});

defineOperator('map', LazyCollection, function <T, U>(ctx: LazyCollection<T>, fn: (item: T) => U): LazyCollection<U> {
  return new LazyCollection(
    (function* () {
      for (const item of ctx) yield fn(item);
    })(),
  );
});

defineOperator('map', AsyncCollection, function <T, U>(ctx: AsyncCollection<T>, fn: (item: T) => U | Promise<U>): AsyncCollection<U> {
  const mapped: Promise<U[]> = ctx.all().then((items) => Promise.all(items.map((item) => Promise.resolve(fn(item)))));

  return new AsyncCollection<U>(mapped);
});

defineOperator('map', AsyncLazyCollection, function <T, U>(ctx: AsyncLazyCollection<T>, fn: (item: T) => U | Promise<U>): AsyncLazyCollection<U> {
  return new AsyncLazyCollection(
    (async function* () {
      for await (const item of ctx) yield await Promise.resolve(fn(item));
    })(),
  );
});
