# Getting Started

Working with complex data arrays and iterables in Node.js shouldn't come at the cost of your application's memory.

`node-collections` is a high-performance, zero-RAM structural data engine. It provides a fluent, highly expressive, and chainable API to construct data pipelines safely and efficiently. Designed as a seamless "drop-in" upgrade for native JavaScript methods, it abstracts away the heavy lifting of memory management and asynchronous iteration.

Whether you are mapping over a simple array, filtering a gigabyte-sized database stream, or reducing complex structural data, `node-collections` automatically routes your data to the most optimized execution engine under the hood. You write the elegant chain; we handle the system resources.

## Installation

Adding `node-collections` to your project is a breeze. Whether you are building a lightweight microservice or a massive enterprise backend, you can install the library via your preferred package manager:

::: code-group

```bash [pnpm]
pnpm add node-collections
```

```bash [npm]
npm install node-collections
```

```bash [yarn]
yarn add node-collections
```

```bash [bun]
bun add node-collections
```

:::

## Engine Overview & Routing Strategy

Unlike standard utility libraries, `node-collections` operates on a **Multi-Engine Architecture**. To guarantee optimal performance and memory safety, the internal processing behavior adapts based on the data source you provide.

### The Smart Gateway: `collect()`

Forget about manually instantiating complex engine classes or worrying about which iterator pattern to implement. At the heart of the library lies a single, intelligent helper: `collect()`.

Think of `collect()` as a smart router for your data structures. You simply pass in your data—be it a static array, a `Map`, or a massive asynchronous database stream—and the helper instantly inspects the type at runtime, wrapping it in the most computationally efficient engine.

You write the exact same fluent, elegant chain, and the underlying engine handles the system resources:

- **Arrays (`[]`)** are routed to **`Collection`** for blazing-fast, eager synchronous execution.
- **Iterables (`Set`, `Map`, `Generator`)** are routed to **`LazyCollection`** for zero-RAM, deferred synchronous evaluation.
- **Promises (`Promise<T[]>`)** are routed to **`AsyncCollection`** for seamless, non-blocking asynchronous chaining.
- **Streams (`AsyncGenerator`)** are routed to **`AsyncLazyCollection`**, perfect for processing gigabytes of data without stalling the Node.js event loop.

::: info DESIGN PHILOSOPHY
By decoupling the API from the execution context, `node-collections` ensures that your business logic remains clean, readable, and structurally type-safe, regardless of where your data comes from or how large it grows.
:::

---

### A Unified API Experience

Because `collect()` abstracts away the underlying engine, you don't need to learn different methods for different data types. The API remains consistent across the board.

```typescript
import { collect } from 'node-collections';

// 1. Passing a standard Array (Eager Execution)
const eagerResult = collect([1, 2, 3])
  .map((n) => n * 2)
  .toArray();

// 2. Passing a Generator (Lazy Execution)
function* generateNumbers() {
  yield 1;
  yield 2;
  yield 3;
}

const lazyResult = collect(generateNumbers())
  .map((n) => n * 2)
  .toArray(); // The exact same API!
```

You do not need to manually instantiate different classes. The library exposes a single, smart entry point: `collect()`. When you pass arguments into `collect()`, it inspects the input type at runtime and routes it to one of four highly optimized execution engines:

- **Arrays (`[]`)** $\rightarrow$ Routes to `Collection` (Eager Synchronous).
- **Iterables (`Set`, `Map`, `Generator`)** $\rightarrow$ Routes to `LazyCollection` (Deferred Synchronous).
- **Promises (`Promise<T[]>`)** $\rightarrow$ Routes to `AsyncCollection` (Eager Asynchronous).
- **Streams (`AsyncGenerator`, ReadableStream)** $\rightarrow$ Routes to `AsyncLazyCollection` (Deferred Asynchronous).

::: info Deep Dive Deferred Pipeline Execution
For a deep dive into how Deferred pipelines prevent memory spikes (Zero-RAM overhead) and how the internal architecture works, please refer to the [Architecture Overview](https://www.google.com/search?q=/guide/architecture)
:::

## Exploring the Engines

Because `collect()` is smart enough to adapt to your data, you can freely mix and match data sources without ever changing how you write your business logic. Let's look at how gracefully it handles different scenarios.

### The Daily Driver

#### Eager Synchronous (`Collection`)

Sometimes you just need to process a standard array in memory, but you want to do it beautifully. When you pass a native `Array`, the engine seamlessly defaults to `Collection` for blazing-fast, eager execution. It's the perfect daily driver for standard data transformations where immediate evaluation is required.

```typescript
import { collect } from 'node-collections';

// Scenario: Calculating a Bill of Quantities (BoQ) subtotal
const materials = [
  { id: 'ST-01', item: 'Steel Beam', category: 'structural', cost: 1200 },
  { id: 'CN-01', item: 'Cement', category: 'foundation', cost: 300 },
  { id: 'ST-02', item: 'Rebar', category: 'structural', cost: 850 },
];

const structuralCosts = collect(materials)
  .where('category', 'structural')
  .map((m) => m.cost * 1.1) // Elegantly apply a 10% tax/margin
  .toArray();

console.log(structuralCosts); // [1320, 935]
```

### Zero-RAM Footprint

#### Deferred Synchronous (`LazyCollection`)

Mapping over a massive native array is a memory leak waiting to happen. By passing a `Set`, `Map`, or `Generator`, the engine automatically shifts into a `LazyCollection`. Data is evaluated _one item at a time_ on the fly. You get to cleanly transform native JavaScript collections while your memory footprint remains completely flat.

```typescript
import { collect } from 'node-collections';

// Scenario: Filtering a Map of heavy machinery statuses on a job site
const equipmentLog = new Map([
  ['CRANE-01', { status: 'active', fuel: 80 }],
  ['EXCAV-02', { status: 'maintenance', fuel: 10 }],
  ['DOZER-03', { status: 'active', fuel: 15 }],
]);

// Evaluates lazily. No intermediate arrays are ever created.
const needsRefueling = collect(equipmentLog)
  .filter(([id, data]) => data.status === 'active' && data.fuel < 20)
  .map(([id]) => id)
  .toArray();

console.log(needsRefueling); // ['DOZER-03']
```

### First-Class Promises

#### Eager Asynchronous (`AsyncCollection`)

Modern Node.js applications are built on asynchronous I/O. `node-collections` treats Promises as first-class citizens. When you pass a Promise (or an array of Promises), the `AsyncCollection` engine takes over. It automatically unwraps the resolved data and allows you to use `async/await` directly inside your chain—no more messy `Promise.all()` spaghetti.

```typescript
import { collect } from 'node-collections';

// Scenario: Fetching project milestones from a REST API
const fetchProjectPhases = Promise.resolve([
  { phaseId: 1, name: 'Design', completed: true },
  { phaseId: 2, name: 'Procurement', completed: false },
]);

// Seamlessly await async operations inside the fluent pipeline
const pendingPhases = await collect(fetchProjectPhases)
  .filter(async (phase) => !phase.completed)
  .map(async (phase) => phase.name)
  .toArray();

console.log(pendingPhases); // ['Procurement']
```

### The Enterprise Workhorse

#### Deferred Asynchronous (`AsyncLazyCollection`)

When you need to process gigabytes of data—like streaming a massive database cursor or reading heavy CSV logs—the `AsyncLazyCollection` handles the heavy lifting without breaking a sweat. It combines the zero-RAM architecture of lazy evaluation with the non-blocking power of asynchronous streams, ensuring your Node.js event loop never stalls.

```typescript
import { collect } from 'node-collections';

// Scenario: Streaming a massive supply chain procurement log line-by-line
async function* streamProcurementData() {
  yield { vendor: 'BuildCorp', material: 'Steel', price: 5000 };
  yield { vendor: 'Apex', material: 'Glass', price: 2000 };
  yield { vendor: 'Structura', material: 'Steel', price: 4800 };
  // ... imagine 1,000,000 more records yielded here without crashing memory
}

// Data flows through the pipeline sequentially and asynchronously.
const optimalSteelVendors = await collect(streamProcurementData())
  .where('material', 'Steel')
  .filter(async (record) => record.price < 4900)
  .take(1) // Instantly halts the massive stream once 1 match is found
  .toArray();

console.log(optimalSteelVendors); // [{ vendor: 'Structura', material: 'Steel', price: 4800 }]
```

::: tip THE POWER OF `.take()`
Notice the `.take(1)` in the final example. Because the stream is evaluated lazily, the engine immediately closes the generator and stops reading data the millisecond it finds the first matching vendor, saving massive amounts of compute time.
:::
