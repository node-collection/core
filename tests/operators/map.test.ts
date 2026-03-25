import { describe, it, expect } from 'vitest';
import { collect } from '@/index';
import { Collection } from '@/core/engines/sync/collection';
import { LazyCollection } from '@/core/engines/sync/lazy-collection';
import { AsyncCollection } from '@/core/engines/async/async-collection';
import { AsyncLazyCollection } from '@/core/engines/async/async-lazy-collection';

describe('collect() factory', () => {
  describe('routing', () => {
    it('T[] → Collection', () => {
      expect(collect([1, 2, 3])).toBeInstanceOf(Collection);
    });

    it('Promise<T>[] → AsyncCollection', () => {
      expect(collect([Promise.resolve(1)])).toBeInstanceOf(AsyncCollection);
    });

    it('AsyncIterable → AsyncLazyCollection', () => {
      async function* gen() {
        yield 1;
      }
      expect(collect(gen())).toBeInstanceOf(AsyncLazyCollection);
    });

    it('Set → LazyCollection', () => {
      expect(collect(new Set([1, 2]))).toBeInstanceOf(LazyCollection);
    });

    it('Map.values() → LazyCollection', () => {
      const map = new Map([['a', 1]]);
      expect(collect(map.values())).toBeInstanceOf(LazyCollection);
    });

    it('Generator → LazyCollection', () => {
      function* gen() {
        yield 1;
      }
      expect(collect(gen())).toBeInstanceOf(LazyCollection);
    });
  });

  // ─────────────────────────────────────────
  // Integration: collect + map
  // ─────────────────────────────────────────
  describe('integration', () => {
    it('collect(T[]).map().all()', () => {
      expect(
        collect([1, 2, 3])
          .map((x) => x * 10)
          .all(),
      ).toEqual([10, 20, 30]);
    });

    it('collect(Set).map().all()', () => {
      function* gen() {
        yield 1;
        yield 2;
        yield 3;
      }
      expect(
        collect(gen())
          .map((x) => x + 1)
          .all(),
      ).toEqual([2, 3, 4]);
    });

    it('collect(Promise[]).map().all()', async () => {
      const result = await collect([Promise.resolve(5), Promise.resolve(10)])
        .map((x) => x * 2)
        .all();
      expect(result).toEqual([10, 20]);
    });

    it('collect(AsyncGenerator).map() for await', async () => {
      async function* gen() {
        yield 100;
        yield 200;
      }
      const results: number[] = [];
      for await (const v of collect(gen()).map(async (x) => x / 2)) {
        results.push(v);
      }
      expect(results).toEqual([50, 100]);
    });
  });

  // ─────────────────────────────────────────
  // Edge cases
  // ─────────────────────────────────────────
  describe('edge cases', () => {
    it('empty array → empty Collection', () => {
      expect(collect([]).all()).toEqual([]);
    });

    it('empty Set → empty LazyCollection', () => {
      expect(collect(new Set()).all()).toEqual([]);
    });

    it('null fallback → empty Collection', () => {
      expect(collect(null as any).all()).toEqual([]);
    });
  });
});
