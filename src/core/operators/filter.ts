import { defineOperator } from '@/core/define';
import { AsyncCollection } from '@/core/engines/async/async-collection';
import { AsyncLazyCollection } from '@/core/engines/async/async-lazy-collection';
import { Collection } from '@/core/engines/sync/collection';
import { LazyCollection } from '@/core/engines/sync/lazy-collection';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /** 🟢 Sync Eager: Filter array secara langsung */
    filter(fn: (item: T) => boolean): Collection<T>;
  }
  interface LazyEnumerableMethods<T> {
    /** 🟡 Sync Lazy: Predicate diperiksa saat iterasi berjalan */
    filter(fn: (item: T) => boolean): LazyCollection<T>;
  }
  interface AsyncEnumerableMethods<T> {
    /** 🔵 Async Eager: Filter list of Promises (Awaited) */
    filter(fn: (item: T) => boolean | Promise<boolean>): AsyncCollection<T>;
  }
  interface AsyncLazyEnumerableMethods<T> {
    /** 🟣 Async Lazy: Stream filter via Async Generator */
    filter(fn: (item: T) => boolean | Promise<boolean>): AsyncLazyCollection<T>;
  }
}

// 🟢 Sync Eager: Outputnya Collection<T>
defineOperator('filter', Collection, function <T>(ctx: Collection<T>, fn: (item: T) => boolean) {
  return new Collection(ctx.all().filter(fn));
});

// 🟡 Sync Lazy: Outputnya LazyCollection<T>
defineOperator('filter', LazyCollection, function <T>(ctx: LazyCollection<T>, fn: (item: T) => boolean) {
  const generator = function* () {
    for (const item of ctx) {
      if (fn(item)) yield item;
    }
  };
  return new LazyCollection(generator());
});

// 🔵 Async Eager: Outputnya AsyncCollection<T>
defineOperator('filter', AsyncCollection, function <T>(ctx: AsyncCollection<T>, fn: (item: T) => boolean | Promise<boolean>) {
  const filteredPromises = ctx.all().then(async (items) => {
    // Kita jalankan predicate secara paralel (Performance Boss!)
    const results = await Promise.all(items.map(async (item) => await fn(item)));
    return items.filter((_, index) => results[index]);
  });

  return new AsyncCollection(filteredPromises);
});

// 🟣 Async Lazy: Outputnya AsyncLazyCollection<T>
defineOperator('filter', AsyncLazyCollection, function <T>(ctx: AsyncLazyCollection<T>, fn: (item: T) => boolean | Promise<boolean>) {
  const asyncGenerator = async function* () {
    for await (const item of ctx) {
      // Tunggu hasil predicate (bisa sync atau async)
      if (await fn(item)) yield item;
    }
  };
  return new AsyncLazyCollection(asyncGenerator());
});
