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

  ### 📊 Laravel Collections Parity Matrix (v1.1 Roadmap)

| Method             | Sync (Eager) | Sync (Lazy) | Async (Eager) | Async (Lazy) | Description                                                                  |
| :----------------- | :----------: | :---------: | :-----------: | :----------: | :--------------------------------------------------------------------------- |
| **all / toArray**  |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Get all items as a plain array.                                              |
| **average / avg**  |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the average value of the items.                                          |
| **before**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the item before the specified item.                                      |
| **chunk**          |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Chunk the collection into sizes of `n`.                                      |
| **chunkWhile**     |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Chunk the collection based on a callback condition.                          |
| **collapse**       |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Collapse a collection of arrays into a single, flat collection.              |
| **collect**        |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Factory helper to create a new instance.                                     |
| **combine**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Combine keys and values into an object.                                      |
| **concat**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Append items or another collection to the end.                               |
| **contains**       |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Determine if a value or callback exists (Short-circuit).                     |
| **containsStrict** |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Same as `contains` but using `===` comparison.                               |
| **count**          |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Get the total number of items.                                               |
| **countBy**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Count the occurrences of items in the collection.                            |
| **crossJoin**      |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Cross join the collection with the given lists.                              |
| **dd**             |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Dump the items and end the script.                                           |
| **diff**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Diff the collection against another collection based on values.              |
| **diffAssoc**      |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Diff the collection against another with key checks.                         |
| **diffKeys**       |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Diff the collection against another based on keys.                           |
| **doesntContain**  |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Opposite of `contains`.                                                      |
| **dot**            |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Flatten a multi-dimensional object into a single level using "dot" notation. |
| **dump**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Dump the items without ending the script.                                    |
| **duplicates**     |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Retrieve duplicate items from the collection.                                |
| **each**           |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Iterate over the items (Alias for `tap`).                                    |
| **eachSpread**     |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Iterate over a collection of arrays with destructuring.                      |
| **ensure**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Ensure that all elements in the collection are of a specific type.           |
| **every**          |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Determine if all items pass a given truth test.                              |
| **except**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get all items except those with specified keys.                              |
| **filter**         |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Filter the collection using a callback.                                      |
| **first**          |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Get the first item (supports default values).                                |
| **firstOrFail**    |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the first item or throw an Error if not found.                           |
| **firstWhere**     |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the first item matching the given key-value pair.                        |
| **flatMap**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Map over items and flatten the result by one level.                          |
| **flatten**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Flatten a multi-dimensional array (deep flatten).                            |
| **flip**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Swap the collection's keys with their values.                                |
| **forget**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Remove an item from the collection by its key.                               |
| **forPage**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Simple pagination: get items for page `n`.                                   |
| **fromJson**       |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Create a collection from a JSON string.                                      |
| **get**            |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Retrieve an item by its key or index.                                        |
| **groupBy**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Group items by a given key or callback result.                               |
| **has**            |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Determine if a key exists in the collection.                                 |
| **hasAny**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Determine if any of the given keys exist.                                    |
| **implode**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Concatenate the items into a single string.                                  |
| **intersect**      |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the intersection of values with another collection.                      |
| **isEmpty**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Determine if the collection is empty.                                        |
| **isNotEmpty**     |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Determine if the collection is not empty.                                    |
| **join**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Join the collection's values with a string separator.                        |
| **keyBy**          |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Re-key the collection by a specific property.                                |
| **keys**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get all keys of the collection.                                              |
| **last**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the last item in the collection.                                         |
| **lazy**           |    `[x]`     |    `[-]`    |     `[x]`     |    `[-]`     | Convert an Eager collection into a Lazy one.                                 |
| **map**            |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Transform each item in the collection.                                       |
| **mapInto**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Instantiate a class for each item.                                           |
| **mapSpread**      |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Map over array items with destructuring.                                     |
| **mapToGroups**    |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Map items into grouped collections.                                          |
| **mapWithKeys**    |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Map items and define custom keys.                                            |
| **max**            |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the maximum value of the collection.                                     |
| **median**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the median value of the collection.                                      |
| **merge**          |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Merge the collection with another (Eager).                                   |
| **min**            |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the minimum value of the collection.                                     |
| **mode**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the mode (most frequent value).                                          |
| **multiply**       |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Duplicate the collection `n` times.                                          |
| **nth**            |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Create a collection with every n-th item.                                    |
| **only**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get only items with specified keys.                                          |
| **pad**            |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Pad the collection to a specific length.                                     |
| **partition**      |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Separate into 2 collections (passed vs failed filter).                       |
| **percentage**     |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Calculate the percentage of items matching a condition.                      |
| **pipe**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Pass the collection to an external callback.                                 |
| **pluck**          |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Retrieve a specific property from a list of objects.                         |
| **pop**            |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Remove and return the last item.                                             |
| **prepend**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Add an item to the beginning of the collection.                              |
| **pull**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Retrieve and remove an item by its key.                                      |
| **push**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Add an item to the end of the collection (Eager).                            |
| **random**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get a random item from the collection.                                       |
| **range**          |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Create a collection from a numerical range.                                  |
| **reduce**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Reduce items to a single value (Aggregation).                                |
| **reject**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | The opposite of `filter`.                                                    |
| **reverse**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Reverse the order of items.                                                  |
| **search**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Search for a value and return its key/index.                                 |
| **shift**          |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Remove and return the first item.                                            |
| **shuffle**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Shuffle the order of items.                                                  |
| **skip**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Skip the first `n` items.                                                    |
| **slice**          |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Extract a slice of the collection.                                           |
| **sliding**        |    `[ ]`     |    `[ ]`    |     `[ ]"     |    `[ ]`     | Create overlapping chunks (sliding window).                                  |
| **sole**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get the only item, error if not exactly one.                                 |
| **some**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Alias for `contains`.                                                        |
| **sort**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Sort the collection's values.                                                |
| **sortBy**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Sort the collection by key or callback.                                      |
| **sortByDesc**     |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Sort items in descending order.                                              |
| **splice**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Slice and replace parts of the collection.                                   |
| **split**          |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Split the collection into `n` groups.                                        |
| **sum**            |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Calculate the sum of values.                                                 |
| **take**           |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Take the first `n` items.                                                    |
| **tap**            |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Perform a side-effect in the middle of a pipeline.                           |
| **times**          |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Run a callback `n` times.                                                    |
| **union**          |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Merge without overwriting existing keys.                                     |
| **unique**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Retrieve only unique items.                                                  |
| **unless**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Execute if the condition is `false`.                                         |
| **unwrap**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Extract the raw array from the collection wrapper.                           |
| **values**         |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Get values and reset keys.                                                   |
| **when**           |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Execute if the condition is `true`.                                          |
| **where**          |    `[x]`     |    `[x]`    |     `[x]`     |    `[x]`     | Filter items by key-value pairs.                                             |
| **whereBetween**   |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Filter items within a range.                                                 |
| **whereIn**        |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Filter items within a list.                                                  |
| **whereNull**      |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Filter items that are `null`.                                                |
| **zip**            |    `[ ]`     |    `[ ]`    |     `[ ]`     |    `[ ]`     | Pair items from two collections.                                             |

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
