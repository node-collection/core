import { defineOperator } from '../define';
import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';

declare module '@/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /** 🟢 Sync Eager: Ambil N data pertama dari Array */
    take(limit: number): Collection<T>;
  }
  interface LazyEnumerableMethods<T> {
    /** 🟡 Sync Lazy: Berhenti iterasi tepat setelah limit tercapai */
    take(limit: number): LazyCollection<T>;
  }
  interface AsyncEnumerableMethods<T> {
    /** 🔵 Async Eager: Ambil N data pertama dari list of Promises */
    take(limit: number): AsyncCollection<T>;
  }
  interface AsyncLazyEnumerableMethods<T> {
    /** 🟣 Async Lazy: Berhenti tarik data dari stream setelah limit tercapai */
    take(limit: number): AsyncLazyCollection<T>;
  }
}

/**
 * 🟢 Sync Eager Implementation
 */
defineOperator('take', Collection, function <T>(ctx: Collection<T>, limit: number): Collection<T> {
  const safeLimit = Math.max(0, limit);
  return new Collection(ctx.all().slice(0, safeLimit));
});

/**
 * 🟡 Sync Lazy Implementation (Short-Circuit)
 */
defineOperator('take', LazyCollection, function <T>(ctx: LazyCollection<T>, limit: number): LazyCollection<T> {
  return new LazyCollection(
    (function* () {
      if (limit <= 0) return;
      let count = 0;
      for (const item of ctx) {
        yield item;
        if (++count >= limit) break; // 🛑 Memutus rantai iterasi ke atas
      }
    })(),
  );
});

/**
 * 🔵 Async Eager Implementation
 */
defineOperator('take', AsyncCollection, function <T>(ctx: AsyncCollection<T>, limit: number): AsyncCollection<T> {
  const sliced = ctx.all().then((items) => {
    const safeLimit = Math.max(0, limit);
    return items.slice(0, safeLimit);
  });

  return new AsyncCollection(sliced);
});

/**
 * 🟣 Async Lazy Implementation (Backpressure Friendly)
 */
defineOperator('take', AsyncLazyCollection, function <T>(ctx: AsyncLazyCollection<T>, limit: number): AsyncLazyCollection<T> {
  return new AsyncLazyCollection(
    (async function* () {
      if (limit <= 0) return;
      let count = 0;
      for await (const item of ctx) {
        yield item;
        if (++count >= limit) break; // 🛑 Berhenti menarik data dari source (API/Stream)
      }
    })(),
  );
});
