# Development Roadmap

With the successful release of v1.0.0, `node-collections` has established its core architecture: the Multi-Engine routing, Lazy/Eager evaluation, and the zero-RAM generator pipeline.

Our upcoming milestones are focused on expanding the operator ecosystem, introducing high-concurrency async capabilities, and seamlessly integrating with modern Node.js frameworks.

## Phase 1: Core Expansion & Analytics (v1.1 - v1.2)

_Focus: Expanding the built-in operators to cover 90% of daily data manipulation needs and proving performance._

- **Math & Aggregation Operators**
  - `sum()`, `average()`, `min()`, `max()`
  - `reduce()` for custom aggregations across both Sync and Async streams.
- **Structural Grouping**
  - `groupBy()`: Categorize data streams into key-value pairs cleanly.
  - `chunk(size)`: Split massive streams into manageable batches (crucial for database bulk inserts).
- **Sorting & Ordering**
  - `sortBy(key)` and `orderByDescending()`.
- **Public Benchmarks Dashboard**
  - Publish the `k6` and `vitest` unified benchmark results directly in the documentation to visually prove the zero-RAM overhead against Lodash and Native Arrays.

## Phase 2: Advanced Concurrency & Streaming (v1.3 - v1.5)

_Focus: Unlocking the true power of the `AsyncLazyCollection` for heavy I/O operations and microservices._

- **Concurrent Asynchronous Operators**
  - `parallelMap(concurrencyLimit)`: Process async streams in parallel rather than sequentially, while strictly respecting a maximum concurrency limit to prevent memory/connection exhaustion.
- **Native Stream Bridging**
  - `toStream()`: Seamlessly pipe a `node-collections` pipeline directly into a Node.js `WritableStream` (e.g., `fs.createWriteStream` or an HTTP response).
  - `fromStream()`: Native consumption of `ReadableStream` data chunk-by-chunk.
- **Error Handling & Resilience**
  - `catchError()` operator to gracefully handle failing items in a long-running lazy pipeline without destroying the entire stream.

## Phase 3: Domain-Specific Extensions (v2.0)

_Focus: Leveraging the Microkernel Plugin system to support specific architectural domains._

- **Tree & Graph Traversal Plugins**
  - Official plugins for structural data traversal (e.g., `flattenTree()`, `findDeep()`).
- **AI & Agentic Data Pipelines**
  - Tools to stream and chunk data efficiently for Vector Database ingestion (RAG pipelines) and LLM context window preparation.
- **Ecosystem Integrations**
  - `@node-collections/nestjs`: A module to inject and stream collections directly through NestJS interceptors.
  - `@node-collections/prisma`: Direct integration to wrap Prisma cursors into `AsyncLazyCollection` automatically.

---

## Contributing to the Roadmap

`node-collections` is built on a pluggable microkernel architecture. If you need an operator that isn't on this roadmap, you don't need to wait for a core release. You can build it using `defineOperator` and share it with the community!

Check out the [Extending with Plugins](/guide/plugins) guide to get started.
