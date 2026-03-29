[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: Enumerable\<T\>

Defined in: [core/contracts/enumerable.ts:185](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L185)

Base contract for all **synchronous** collection engines.

Extends the native `Iterable<T>` protocol, making every
synchronous collection compatible with `for...of`, spread (`[...col]`),
`Array.from()`, and destructuring out of the box.

The methods defined here are **terminal** — they materialise elements
and return plain values rather than new collection instances.
Transformation operators (`map`, `filter`, etc.) live on
`EnumerableMethods` and `LazyEnumerableMethods`.

## See

 - `Collection`
 - `LazyCollection`

## Extends

- `Iterable`\<`T`\>.[`BaseEnumerable`](BaseEnumerable.md)\<`T`\>

## Extended by

- [`Collection`](../../../engines/sync/collection/classes/Collection.md)
- [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)

## Type Parameters

### T

`T`

The type of elements held by the collection.

## Methods

### all()

> **all**(): `T`[]

Defined in: [core/contracts/enumerable.ts:202](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L202)

Materialises all elements into a plain JavaScript array.

For eager collections this returns a shallow copy of the internal
buffer. For lazy collections this triggers full generator evaluation.
The returned array is always a new allocation — mutations do not
affect the source collection.

#### Returns

`T`[]

A new `T[]` containing all elements in insertion order.

#### Example

```ts
const items = collect([10, 20, 30]).all();
// [10, 20, 30]
```

***

### count()

> **count**(): `number`

Defined in: [core/contracts/enumerable.ts:253](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L253)

Returns the total number of elements in the collection.

For eager collections this is an O(1) property access.
For lazy collections backed by a generator, a full traversal
may occur the first time this is called. The result is cached
so subsequent calls remain O(1).

#### Returns

`number`

The element count as a number.

#### Example

```ts
collect([1, 2, 3]).count(); // 3
collect(new Set([1, 2])).count(); // 2
```

***

### current()

> **current**(): `T` \| `undefined`

Defined in: [core/contracts/enumerable.ts:273](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L273)

Returns the element at the current iterator cursor position.

The cursor advances with each yielded item during a `for...of`
loop. Calling `current()` outside of iteration returns the last
item that was yielded, or `undefined` if iteration has not started.

#### Returns

`T` \| `undefined`

The current element, or `undefined` before the first yield.

#### Example

```ts
const col = collect([10, 20, 30]);

for (const item of col) {
  console.log(col.current()); // 10, then 20, then 30
}
```

***

### progress()

> **progress**(): `number`

Defined in: [core/contracts/enumerable.ts:333](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L333)

Returns the percentage of elements yielded in the current pass (0–100).

Calculated as `Math.round((cursor / total) * 100)`. Useful for
rendering progress bars or logging pipeline throughput.
Returns `0` when total is `0` or unknown.

#### Returns

`number`

An integer between `0` and `100` inclusive.

#### Example

```ts
const col = collect([1, 2, 3, 4]);
let i = 0;

for (const _ of col) {
  if (++i === 2) console.log(col.progress()); // 50
}
```

***

### remaining()

> **remaining**(): `number` \| `null`

Defined in: [core/contracts/enumerable.ts:312](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L312)

Returns the number of elements not yet consumed by the current pass.

Calculated as `total() - cursor`. Meaningful during active `for...of`
iteration; after a full pass it returns `0`. For lazy collections
backed by an infinite generator, this may return `null` if the
total is not yet determinable.

#### Returns

`number` \| `null`

Remaining element count, or `null` if total is unknown.

#### Example

```ts
const col = collect([1, 2, 3]);

for (const _ of col) {
  console.log(col.remaining()); // 2, then 1, then 0
}
```

***

### toArray()

> **toArray**(): `T`[]

Defined in: [core/contracts/enumerable.ts:235](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L235)

Alias for `all`.

Provided for API symmetry with the async engines, where
`toArray()` is the idiomatic way to drain an async iterable
into a plain array.

#### Returns

`T`[]

A new `T[]` containing all elements.

#### Example

```ts
const arr = collect(new Set([1, 2, 3])).toArray();
// [1, 2, 3]
```

***

### toJSON()

> **toJSON**(): `T`[]

Defined in: [core/contracts/enumerable.ts:218](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L218)

Serialises the collection to a plain array for `JSON.stringify`.

Called automatically by `JSON.stringify`. Delegates to `all`,
so the output is identical — a new `T[]` in insertion order.

#### Returns

`T`[]

A new `T[]` suitable for JSON serialisation.

#### Example

```ts
const json = JSON.stringify(collect([1, 2, 3]));
// '[1,2,3]'
```

***

### toString()

> **toString**(): `string`

Defined in: [core/contracts/enumerable.ts:35](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L35)

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

#### Inherited from

[`BaseEnumerable`](BaseEnumerable.md).[`toString`](BaseEnumerable.md#tostring)

***

### total()

> **total**(): `number`

Defined in: [core/contracts/enumerable.ts:291](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L291)

Returns the total number of elements in the collection.

Identical to `count` — both exist for API symmetry with
the async engines. Use `count` when semantics are about
"how many items", and `total()` when semantics are about
"out of how many items total".

#### Returns

`number`

The total element count.

#### Example

```ts
const col = collect([1, 2, 3, 4, 5]);
col.total(); // 5
```
