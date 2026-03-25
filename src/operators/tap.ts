import { defineOperator } from '@/core/define';
import { AsyncCollection } from '@/core/engines/async/async-collection';
import { AsyncLazyCollection } from '@/core/engines/async/async-lazy-collection';
import { Collection } from '@/core/engines/sync/collection';
import { LazyCollection } from '@/core/engines/sync/lazy-collection';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /** 🟢 Sync Eager: Intip data Array */
    tap(fn: (item: T) => void): Collection<T>;
  }
  interface LazyEnumerableMethods<T> {
    /** 🟡 Sync Lazy: Intip data saat iterasi berjalan */
    tap(fn: (item: T) => void): LazyCollection<T>;
  }
  interface AsyncEnumerableMethods<T> {
    /** 🔵 Async Eager: Intip data list of Promises */
    tap(fn: (item: T) => void | Promise<void>): AsyncCollection<T>;
  }
  interface AsyncLazyEnumerableMethods<T> {
    /** 🟣 Async Lazy: Intip data dari stream asinkron */
    tap(fn: (item: T) => void | Promise<void>): AsyncLazyCollection<T>;
  }
}

/** 🟢 1. Sync Eager */
defineOperator('tap', Collection, function <T>(ctx: Collection<T>, fn: (item: T) => void) {
  ctx.all().forEach(fn);
  return ctx;
});

/** 🟡 2. Sync Lazy */
defineOperator('tap', LazyCollection, function <T>(ctx: LazyCollection<T>, fn: (item: T) => void) {
  return new LazyCollection(
    (function* () {
      for (const item of ctx) {
        fn(item);
        yield item;
      }
    })(),
  );
});

/** 🔵 3. Async Eager */
defineOperator('tap', AsyncCollection, function <T>(ctx: AsyncCollection<T>, fn: (item: T) => void | Promise<void>) {
  const tapped = ctx.all().then(async (items) => {
    for (const item of items) await Promise.resolve(fn(item));
    return items;
  });
  return new AsyncCollection(tapped);
});

/** 🟣 4. Async Lazy */
defineOperator('tap', AsyncLazyCollection, function <T>(ctx: AsyncLazyCollection<T>, fn: (item: T) => void | Promise<void>) {
  return new AsyncLazyCollection(
    (async function* () {
      for await (const item of ctx) {
        await Promise.resolve(fn(item));
        yield item;
      }
    })(),
  );
});
