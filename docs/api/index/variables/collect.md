[**Node Collections API v1.0.0**](../../index.md)

***

# Variable: collect

> `const` **collect**: [`CollectionFactory`](../../core/collect/type-aliases/CollectionFactory.md)

Defined in: [index.ts:40](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/index.ts#L40)

The primary entry point for creating collections.
* This function automatically detects your data source (Array, Promise,
Iterable, or AsyncIterable) and wraps it in the most efficient
collection engine.
*

## Example

```ts
import { collect } from 'node-collections';
* // Eager Sync
const list = collect([1, 2, 3]).map(x => x * 2).all();
* // Lazy Async (Streams)
const stream = collect(asyncGenerator).filter(async (u) => u.isActive);
```
*
