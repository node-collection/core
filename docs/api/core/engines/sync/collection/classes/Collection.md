[**Node Collections API v1.0.0**](../../../../../index.md)

***

# Class: Collection\<T\>

Defined in: [core/engines/sync/collection.ts:4](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L4)

An eager, synchronous collection backed by a plain JavaScript array.

Every operator registered via `defineOperator` on this engine evaluates
immediately — each step materialises its result into a new array before
the next step begins. This makes `Collection` the most predictable engine:
stack traces are simple, memory usage is proportional to element count,
and you can inspect intermediate results at any point.

Choose `Collection` when:
- Your dataset fits comfortably in memory.
- You need random access or multiple full passes over the data.
- You are chaining many small, cheap transformations.

For memory-constrained pipelines over large or infinite sequences,
prefer `LazyCollection`. For datasets backed by Promises or async
generators, see `AsyncCollection` and `AsyncLazyCollection`.

## See

 - `collect` — preferred factory function
 - `LazyCollection` — deferred sync alternative

## Example

```ts
const result = collect([1, 2, 3, 4, 5])
  .filter(n => n % 2 === 0)
  .map(n => n * 10)
  .all();
// [20, 40]
```

## Extends

- [`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md)\<`T`\>.[`EnumerableMethods`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md)\<`T`\>

## Type Parameters

### T

`T`

The type of elements held by this collection.

## Constructors

### Constructor

> **new Collection**\<`T`\>(`items`): `Collection`\<`T`\>

Defined in: [core/engines/sync/collection.ts:65](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L65)

Creates a new `Collection` wrapping the given array.

The source array is stored by reference — it is never cloned on
construction. A safe shallow copy is produced only when you call
`all`, `toArray`, or `toJSON`.

#### Parameters

##### items

`T`[]

The source `T[]` to wrap.

#### Returns

`Collection`\<`T`\>

#### Example

```ts
const col = new Collection([1, 2, 3]);
// or via the factory:
const col = collect([1, 2, 3]);
```

#### Inherited from

`Enumerable<T>.constructor`

## Properties

### \_cursor

> `protected` **\_cursor**: `number` = `0`

Defined in: [core/engines/sync/collection.ts:47](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L47)

**`Internal`**

Internal iterator cursor. Advanced by one for each item yielded
during a `for...of` loop. Reset to `0` at the start of each pass.

***

### items

> `protected` **items**: `T`[]

Defined in: [core/engines/sync/collection.ts:65](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L65)

The source `T[]` to wrap.

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Generator`\<`T`, `void`, `unknown`\>

Defined in: [core/engines/sync/collection.ts:289](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L289)

Iterates over all elements in insertion order.

Implements the `Iterable<T>` protocol, making `Collection` compatible
with `for...of`, spread syntax (`[...col]`), `Array.from()`, and
destructuring. The cursor resets to `0` at the start of each call,
so the collection is safely re-iterable any number of times.

#### Returns

`Generator`\<`T`, `void`, `unknown`\>

#### Yields

Each element `T` in the order it was inserted.

#### Example

```ts
const col = collect([10, 20, 30]);

for (const item of col) {
  console.log(item); // 10, 20, 30
}

const spread = [...col]; // [10, 20, 30]
const [first, second] = col; // 10, 20
```

#### Inherited from

`Enumerable.[iterator]`

***

### all()

> **all**(): `T`[]

Defined in: [core/engines/sync/collection.ts:87](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L87)

Materialises all elements into a new plain array.

Returns a **shallow copy** of the internal buffer — mutations to
the returned array do not affect the source collection or any
subsequent operator calls. This is the primary way to exit the
collection pipeline and retrieve a standard JavaScript array.

#### Returns

`T`[]

A new `T[]` containing every element in insertion order.

#### Example

```ts
const items = collect([1, 2, 3]).all();
// [1, 2, 3]

items.push(99); // safe — does not mutate the collection
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`all`](../../../../contracts/enumerable/interfaces/Enumerable.md#all)

***

### count()

> **count**(): `number`

Defined in: [core/engines/sync/collection.ts:152](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L152)

Returns the total number of elements in the collection.

Delegates to `total`. Both methods exist for API expressiveness:
use `count()` when the semantic intent is "how many items are there",
and `total()` when the intent is "out of how many items total".

This is an O(1) operation — the length is read directly from
the internal array.

#### Returns

`number`

The element count as a plain number.

#### Example

```ts
collect(['a', 'b', 'c']).count(); // 3
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`count`](../../../../contracts/enumerable/interfaces/Enumerable.md#count)

***

### current()

> **current**(): `T` \| `undefined`

Defined in: [core/engines/sync/collection.ts:192](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L192)

Returns the element at the current iterator cursor position.

The cursor is advanced by the `[Symbol.iterator]` generator.
Calling `current()` outside of a `for...of` loop returns the item
at index `0`, or `undefined` if the collection is empty.

#### Returns

`T` \| `undefined`

The element at the current cursor, or `undefined`.

#### Example

```ts
const col = collect(['x', 'y', 'z']);

for (const item of col) {
  console.log(col.current()); // 'x', then 'y', then 'z'
}
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`current`](../../../../contracts/enumerable/interfaces/Enumerable.md#current)

***

### filter()

> **filter**(`fn`): `Collection`\<`T`\>

Defined in: [core/operators/filter.ts:10](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/filter.ts#L10)

🟢 Sync Eager: Filter array secara langsung

#### Parameters

##### fn

(`item`) => `boolean`

#### Returns

`Collection`\<`T`\>

#### Inherited from

[`EnumerableMethods`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md).[`filter`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md#filter)

***

### first()

> **first**(`fn?`): `T` \| `null`

Defined in: [core/operators/first.ts:7](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/first.ts#L7)

🎯 Sync: Ambil item pertama (atau yang lolos kriteria)

#### Parameters

##### fn?

(`item`) => `boolean`

#### Returns

`T` \| `null`

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`first`](../../../../contracts/enumerable/interfaces/Enumerable.md#first)

***

### map()

> **map**\<`U`\>(`fn`): `Collection`\<`U`\>

Defined in: [core/operators/map.ts:7](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/map.ts#L7)

🟢 Sync Eager — transform tiap item, hasilkan Collection baru

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U`

#### Returns

`Collection`\<`U`\>

#### Inherited from

[`EnumerableMethods`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md).[`map`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md#map)

***

### pluck()

> **pluck**\<`K`\>(`key`): `Collection`\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:7](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/pluck.ts#L7)

🟢 Sync Eager: Ambil satu properti dari tiap object

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

#### Returns

`Collection`\<`T`\[`K`\]\>

#### Inherited from

[`EnumerableMethods`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md).[`pluck`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md#pluck)

***

### processed()

> **processed**(): `number`

Defined in: [core/engines/sync/collection.ts:261](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L261)

Returns the number of elements that have been visited during
the current (or most recent) `for...of` pass.

Alias for reading the internal `_cursor` value with a semantic name.
Resets to `0` at the start of each new iteration pass.

#### Returns

`number`

The cursor position as a plain number.

#### Example

```ts
const col = collect(['a', 'b', 'c']);
for (const _ of col) { break; }
col.processed(); // 1
```

***

### progress()

> **progress**(): `number`

Defined in: [core/engines/sync/collection.ts:239](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L239)

Returns the percentage of elements yielded in the current pass (0–100).

Calculated as `Math.round((cursor / total) * 100)`. Suitable for
rendering progress bars, writing structured logs, or reporting
pipeline throughput during long-running sync transforms.

Returns `0` when the collection is empty.

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

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`progress`](../../../../contracts/enumerable/interfaces/Enumerable.md#progress)

***

### remaining()

> **remaining**(): `number`

Defined in: [core/engines/sync/collection.ts:214](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L214)

Returns the number of elements not yet consumed by the current pass.

Calculated as `total() - cursor`. Decrements by one for each item
yielded during a `for...of` loop. Returns `total()` before the
first pass begins, and `0` after the pass completes.

#### Returns

`number`

The remaining element count as a plain number.

#### Example

```ts
const col = collect([1, 2, 3]);

for (const _ of col) {
  console.log(col.remaining()); // 2, then 1, then 0
}
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`remaining`](../../../../contracts/enumerable/interfaces/Enumerable.md#remaining)

***

### take()

> **take**(`limit`): `Collection`\<`T`\>

Defined in: [core/operators/take.ts:7](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/take.ts#L7)

🟢 Sync Eager: Ambil N data pertama dari Array

#### Parameters

##### limit

`number`

#### Returns

`Collection`\<`T`\>

#### Inherited from

[`EnumerableMethods`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md).[`take`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md#take)

***

### tap()

> **tap**(`fn`): `Collection`\<`T`\>

Defined in: [core/operators/tap.ts:7](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/tap.ts#L7)

🟢 Sync Eager: Intip data Array

#### Parameters

##### fn

(`item`) => `void`

#### Returns

`Collection`\<`T`\>

#### Inherited from

[`EnumerableMethods`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md).[`tap`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md#tap)

***

### toArray()

> **toArray**(): `T`[]

Defined in: [core/engines/sync/collection.ts:110](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L110)

Alias for `all`. Drains the collection into a plain array.

Provided for API symmetry with `AsyncCollection` and
`AsyncLazyCollection`, where `toArray()` is the idiomatic
way to materialise items from an async pipeline.

#### Returns

`T`[]

A new `T[]` containing every element.

#### Example

```ts
const arr = collect(new Set([1, 2, 3])).toArray();
// [1, 2, 3]
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`toArray`](../../../../contracts/enumerable/interfaces/Enumerable.md#toarray)

***

### toJSON()

> **toJSON**(): `T`[]

Defined in: [core/engines/sync/collection.ts:129](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L129)

Serialises the collection to a plain array for `JSON.stringify`.

Called automatically by `JSON.stringify` — you rarely need to call
this directly. The result is identical to `all`: a new shallow
copy of the internal element buffer.

#### Returns

`T`[]

A new `T[]` in insertion order.

#### Example

```ts
const json = JSON.stringify(collect([{ id: 1 }, { id: 2 }]));
// '[{"id":1},{"id":2}]'
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`toJSON`](../../../../contracts/enumerable/interfaces/Enumerable.md#tojson)

***

### toString()

> **toString**(): `string`

Defined in: [core/engines/sync/collection.ts:317](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L317)

Returns a human-readable label for logging and assertion messages.

Format: `"[NodeCollections::Collection ({processed}/{total} processed)]"`.

#### Returns

`string`

The string label.

#### Example

```ts
const col = collect([1, 2, 3]);
col.toString();
// "[NodeCollections::Collection (0/3 processed)]"
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`toString`](../../../../contracts/enumerable/interfaces/Enumerable.md#tostring)

***

### total()

> **total**(): `number`

Defined in: [core/engines/sync/collection.ts:170](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/collection.ts#L170)

Returns the total number of elements in the collection.

O(1) — reads directly from the internal array's `length` property.
Does not trigger any traversal or materialisation.

#### Returns

`number`

The element count as a plain number.

#### Example

```ts
const col = collect([10, 20, 30, 40]);
col.total(); // 4
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`total`](../../../../contracts/enumerable/interfaces/Enumerable.md#total)

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): `Collection`\<`T`\>

Defined in: [core/operators/where.ts:34](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L34)

🟢 Sync Eager: Filter berdasarkan key & value

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### value

`T`\[`K`\]

##### Returns

`Collection`\<`T`\>

##### Inherited from

[`EnumerableMethods`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md).[`where`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md#where)

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): `Collection`\<`T`\>

Defined in: [core/operators/where.ts:35](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L35)

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### operator

`string`

###### value

`any`

##### Returns

`Collection`\<`T`\>

##### Inherited from

[`EnumerableMethods`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md).[`where`](../../../../contracts/enumerable/interfaces/EnumerableMethods.md#where)
