[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: BaseEnumerable\<T\>

Defined in: [core/contracts/enumerable.ts:13](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L13)

Marker interface shared by every collection engine.

Provides the canonical string representation used in logging,
debugging, and Node.js inspect output. All four engines
— `Collection`, `LazyCollection`, `AsyncCollection`,
and `AsyncLazyCollection` — extend this interface.

## Extended by

- [`Enumerable`](Enumerable.md)
- [`AsyncEnumerable`](AsyncEnumerable.md)

## Type Parameters

### T

`T`

The element type held by the collection.

## Methods

### toString()

> **toString**(): `string`

Defined in: [core/contracts/enumerable.ts:35](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L35)

Returns a human-readable label identifying the engine,
current cursor position, and total element count.

The format mirrors Laravel's `Collection::__toString()` style
and is safe to use in log output or assertion messages.

#### Returns

`string`

A string in the form
  `"[NodeCollections::{ClassName} ({processed}/{total} processed)]"`.

#### Example

```ts
const col = new Collection([1, 2, 3]);
console.log(col.toString());
// "[NodeCollections::Collection (0/3 processed)]"

for (const _ of col) { }
console.log(col.toString());
// "[NodeCollections::Collection (3/3 processed)]"
```
