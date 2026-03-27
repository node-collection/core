import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';

declare module '@/core/contracts/enumerable' {
  interface Enumerable<T> {
    /** 🎯 Sync: Ambil item pertama (atau yang lolos kriteria) */
    first(fn?: (item: T) => boolean): T | null;
  }
  interface AsyncEnumerable<T> {
    /** 🔵 Async: Ambil item pertama secara async */
    first(fn?: (item: T) => boolean | Promise<boolean>): Promise<T | null>;
  }
}

/** 🟢 1. Sync Eager */
defineOperator('first', Collection, function <T>(ctx: Collection<T>, fn?: (item: T) => boolean): T | null {
  const items = ctx.all();
  return fn ? (items.find(fn) ?? null) : (items[0] ?? null);
});

/** 🟡 2. Sync Lazy (Short-circuit!) */
defineOperator('first', LazyCollection, function <T>(ctx: LazyCollection<T>, fn?: (item: T) => boolean): T | null {
  for (const item of ctx) {
    if (!fn || fn(item)) return item;
  }
  return null;
});

/** 🔵 3. Async Eager */
defineOperator('first', AsyncCollection, async function <
  T,
>(ctx: AsyncCollection<T>, fn?: (item: T) => boolean | Promise<boolean>): Promise<T | null> {
  const items = await ctx.all();
  if (!fn) return items[0] ?? null;
  for (const item of items) {
    if (await Promise.resolve(fn(item))) return item;
  }
  return null;
});

/** 🟣 4. Async Lazy (The Most Efficient for Streams) */
defineOperator('first', AsyncLazyCollection, async function <
  T,
>(ctx: AsyncLazyCollection<T>, fn?: (item: T) => boolean | Promise<boolean>): Promise<T | null> {
  for await (const item of ctx) {
    if (!fn || (await Promise.resolve(fn(item)))) return item;
  }
  return null;
});
