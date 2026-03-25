import { defineOperator } from '@/core/define';
import { AsyncCollection } from '@/core/engines/async/async-collection';
import { AsyncLazyCollection } from '@/core/engines/async/async-lazy-collection';
import { Collection } from '@/core/engines/sync/collection';
import { LazyCollection } from '@/core/engines/sync/lazy-collection';

declare module '@/core/contracts/enumerable' {
  interface Enumerable<T> {
    /** 🔍 Sync: Intip data tanpa mengubah isinya */
    tap(fn: (item: T) => void): this;
  }
  interface AsyncEnumerable<T> {
    /** 🔵 Async: Intip data secara async */
    tap(fn: (item: T) => void | Promise<void>): this;
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
