import { collect } from './dist/index';

async function runTest() {
  console.log('🚀 Testing Node Collections (Dist version)...\n');

  // ─────────────────────────────────────────
  // 🟢 1. Sync Eager — plain array
  // ─────────────────────────────────────────
  const sync = collect([1, 2, 3])
    .map((x) => x * 10)
    .all();
  console.log('🟢 Sync Eager (type)  :', collect([1, 2, 3]).constructor.name); // Collection
  console.log('🟢 Sync Eager (result):', sync); // [10, 20, 30]

  // ─────────────────────────────────────────
  // 🟡 2. Sync Lazy — Set / Map / Generator
  // ─────────────────────────────────────────
  function* nums() {
    yield 1;
    yield 2;
    yield 3;
  }

  const lazyFromSet = collect(new Set([1, 2, 3])).map((x) => x + 1);
  const lazyFromGenerator = collect(nums()).map((x) => x * 2);

  console.log('\n🟡 Sync Lazy Set (type)       :', lazyFromSet.constructor.name); // LazyCollection
  console.log('🟡 Sync Lazy Set (result)      :', [...lazyFromSet]); // [2, 3, 4]
  console.log('🟡 Sync Lazy Generator (type)  :', lazyFromGenerator.constructor.name); // LazyCollection
  console.log('🟡 Sync Lazy Generator (result):', [...lazyFromGenerator]); // [2, 4, 6]

  // ─────────────────────────────────────────
  // 🔵 3. Async Eager — array of Promises
  // ─────────────────────────────────────────
  const asyncEager = await collect([Promise.resolve(10), Promise.resolve(20), Promise.resolve(30)])
    .map((x) => x * 2)
    .all();

  console.log('\n🔵 Async Eager (type)  :', collect([Promise.resolve(1)]).constructor.name); // AsyncCollection
  console.log('🔵 Async Eager (result):', asyncEager); // [20, 40, 60]

  // ─────────────────────────────────────────
  // 🟣 4. Async Lazy — async generator / stream
  // ─────────────────────────────────────────
  async function* asyncGen() {
    yield 100;
    yield 200;
    yield 300;
  }

  const asyncLazy = collect(asyncGen()).map(async (x) => x / 2);
  const results: number[] = [];
  for await (const val of asyncLazy) results.push(val);

  console.log('\n🟣 Async Lazy (type)  :', collect(asyncGen()).constructor.name); // AsyncLazyCollection
  console.log('🟣 Async Lazy (result):', results); // [50, 100, 150]

  console.log('\n✅ All tests passed!');
}

runTest().catch(console.error);
