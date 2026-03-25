# 🌊 Node Collection Library

[![npm version](https://img.shields.io/npm/v/node-collection.svg)](https://www.npmjs.com/package/node-collection)
[![license](https://img.shields.io/github/license/elhakim/node-collection)](https://github.com/elhakim/node-collection/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> **Data Manipulation, Evolved.** Bring the magical experience of Laravel Collections to the Node.js ecosystem with perfect Type-Safety and 4-Dimensional Processing.

---

## ✨ Features

- 🛡️ **100% Type-Safe**: Advanced Generics inference. Auto-complete will never break even if you chain 100 functions. Say goodbye to manual type casting.
- ⚡ **4-Dimensional Engines**: Switch between **Sync Eager**, **Sync Lazy**, **Async Eager**, and **Async Lazy** seamlessly.
- 📦 **Zero-RAM Overhead**: Process massive datasets (GBs) using the Lazy "Matryoshka" Pattern. Execution is deferred until strictly necessary.
- 🧩 **Pluggable Architecture**: Micro-kernel design. Build custom operators for your projects as easily as calling a single function.
- 🎸 **Laravel-style API**: Familiar declarative methods like `where`, `pluck`, `tap`, `first`, and dozens more.

---

## 🚀 Installation

```bash
pnpm add node-collection
# or
npm install node-collection
```

---

## 📖 Quick Start

Transform hundreds of lines of imperative, messy code into a single, elegant chain.

```typescript
import { collect } from 'node-collection';

const users = [
  { id: 1, name: 'Suhu Elhakim', status: 'ACTIVE', role: 'Architect' },
  { id: 2, name: 'Junior Dev', status: 'INACTIVE', role: 'Developer' },
  { id: 3, name: 'Mid Dev', status: 'ACTIVE', role: 'Developer' },
];

const result = collect(users)
  .where('status', 'ACTIVE') // 1. Filter active users
  .where('role', '!==', 'Architect') // 2. Exclude Architects
  .pluck('name') // 3. Extract just the names
  .tap((name) => console.log(`Found: ${name}`)) // 4. Introspect safely
  .first(); // 5. Short-circuit & return

console.log(result); // "Mid Dev"
```

---

## 🧠 Architectural Insights

Node Collection isn't just another array wrapper. It is built from the ground up to solve real enterprise problems in Node.js.

### 1\. The 4-Dimension Engines

Native JavaScript `Array.prototype` is entirely **Sync Eager**. If you process a 5GB CSV file using `.map().filter()`, your Node.js server will crash with an _Out of Memory (OOM)_ error. We solve this by introducing 4 distinct engines that intelligently adapt to your data source:

- **Sync Eager (`Collection`)**: Best for standard memory-bound arrays. Immediate execution.
- **Sync Lazy (`LazyCollection`)**: Powered by JavaScript Generators (`function*`). Processes data sequentially.
- **Async Eager (`AsyncCollection`)**: Handles Arrays of Promises. Resolves data concurrently via `Promise.all` for maximum throughput.
- **Async Lazy (`AsyncLazyCollection`)**: Powered by Async Generators (`for await...of`). Perfect for consuming live Network Streams or Database Cursors with zero memory bloating.

### 2\. The Matryoshka Pattern (Short-Circuiting)

In our **Lazy** engines, operations are wrapped like Russian nesting dolls.

If you chain `.filter().map().take(5)`, the engine does **not** iterate over the entire array three times. Instead, data flows through the chain one item at a time. The moment `.take(5)` receives its 5th item, it triggers a `break` command that propagates upwards, completely halting the upstream generator. **You process only what you need.**

### 3\. Extreme Type Inference

Our Generics architecture uses Declaration Merging and strict `keyof` constraints. The compiler acts as your co-pilot. When you call `.pluck('email')`, the returned Collection strictly mutates into `Collection<string>`. Subsequent operators will perfectly suggest string-based methods.

---

## 🛠️ Operator Dictionary

We structure our API into logical groupings so you can find exactly what you need:

### 🏗️ Foundational

- `filter(fn)` - Keep items passing the truth test.
- `where(key, operator?, value?)` - The ultimate dynamic filter.
- `take(limit)` - Slice the collection (triggers short-circuit in lazy mode).

### 🪄 Transformation

- `map(fn)` - Transform items to a new shape.
- `pluck(key)` - Extract a single property dynamically.

### 🔍 Debugging

- `tap(fn)` - Peek into the pipeline without altering the data.

### 🛑 Terminal (Execution Triggers)

- `first(fn?)` - Resolve the chain and return the first matching item.
- `all()` - Resolve the chain into a standard JavaScript `Array`.

---

## 🧩 Extending (Micro-Kernel Architecture)

Node Collection is built to be extended. You can register custom operators globally without touching the core library using our `defineOperator` API and Virtual Method Table (vTable) registry.

```typescript
import { defineOperator, Collection } from 'node-collection';

// 1. Define the type signature
declare module 'node-collection/contracts' {
  interface EnumerableMethods<T> {
    dd(): void; // Dump and Die
  }
}

// 2. Implement the logic safely
defineOperator('dd', Collection, function (ctx) {
  console.dir(ctx.all(), { depth: null, colors: true });
  process.exit(1);
});
```

---

## 🗺️ The Roadmap

We are committed to making Node Collection the standard data manipulation library for Node.js. Here is our flight plan:

### Phase 1: The Essentials (Current Focus)

- [x] Core Micro-Kernel & vTable Registry.
- [x] 4-Dimension Engine Implementation.
- [x] Foundational Operators (`where`, `map`, `filter`, `take`, `first`, `pluck`, `tap`).
- [ ] Advanced Filtering (`whereIn`, `whereBetween`, `whereNull`, `whereRegex`).
- [ ] Aggregation Operators (`reduce`, `sum`, `avg`, `min`, `max`).

### Phase 2: Structural Mastery

- [ ] Grouping (`groupBy`, `partition`).
- [ ] Sorting (`sortBy`, `sortByDesc`).
- [ ] Set Operations (`unique`, `intersect`, `diff`).
- [ ] Chunking & Pagination (`chunk`, `forPage`).

### Phase 3: The I/O Ecosystem

- [ ] Native integration with Node.js `ReadableStream` & `WritableStream`.
- [ ] Out-of-the-box CSV and JSON stream parsers to Lazy Collections.
- [ ] File-system wrappers (`collect.file('data.csv')`).

### Phase 4: Integrations & Benchmarks

- [ ] Official Prisma ORM Adapter.
- [ ] Official MongoDB Cursor Adapter.
- [ ] Comprehensive performance benchmark suite (k6/vitest) proving superiority over Lodash/Native JS.

---

## 📊 Quick Comparison

| Feature                         | Native JS |    LoDash    | Node Collection |
| :------------------------------ | :-------: | :----------: | :-------------: |
| Lazy Evaluation (Short-Circuit) |    ❌     | ⚠️ (Partial) |    ✅ (Full)    |
| Async Stream Support            |    ❌     |      ❌      |       ✅        |
| Perfect Type Inference          |    ⚠️     |      ⚠️      |       ✅        |
| Pluggable vTable Architecture   |    ❌     |      ❌      |       ✅        |
| Memory Efficiency for Big Data  |    Low    |    Medium    |    **High**     |

---

## 🤝 Contributing

We love contributions\! Whether it's adding a new operator from the roadmap, fixing a bug, or improving docs:

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 🌟 Support

If this library saves your server from OOM crashes or makes your code cleaner, please consider giving it a ⭐ on GitHub\!

## 📄 License

ISC © [ElhakimDev99](https://www.google.com/search?q=https://github.com/elhakimdev99)
