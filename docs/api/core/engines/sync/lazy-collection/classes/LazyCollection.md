[**Node Collections API v1.0.0**](../../../../../index.md)

***

# Class: LazyCollection\<T\>

Defined in: [core/engines/sync/lazy-collection.ts:4](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L4)

A lazy, synchronous collection backed by any `Iterable<T>`.

Operator chains are composed as generator pipelines — no work is
performed until you iterate with `for...of` or call `all`.
This keeps memory usage constant relative to the element count,
making `LazyCollection` the right choice for large datasets,
infinite sequences, or pipelines where only a subset of elements
will actually be consumed.

Choose `LazyCollection` when:
- Your source is a generator, `Set`, `Map`, or other non-array iterable.
- You need to process millions of records without buffering them all.
- You plan to `break` out of a loop early and discard the rest.

For datasets already in memory as plain arrays, the simpler
`Collection` is more convenient. For async sources, see
`AsyncLazyCollection`.

## See

 - `collect` — preferred factory function
 - `Collection` — eager sync alternative
 - `AsyncLazyCollection` — lazy async counterpart

## Example

```ts
function* naturals() {
  let n = 0;
  while (true) yield n++;
}

// Only the first 5 even numbers are ever computed:
const result = collect(naturals())
  .filter(n => n % 2 === 0)
  .take(5)
  .all();
// [0, 2, 4, 6, 8]
```

## Extends

- [`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md)\<`T`\>.[`LazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md)\<`T`\>

## Type Parameters

### T

`T`

The type of elements yielded by the source iterable.

## Constructors

### Constructor

> **new LazyCollection**\<`T`\>(`source`): `LazyCollection`\<`T`\>

Defined in: [core/engines/sync/lazy-collection.ts:90](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L90)

Creates a new `LazyCollection` wrapping the given iterable.

The source is **not consumed** on construction — no elements are
pulled until iteration begins. If you pass a generator function's
result, it will be exhausted on the first full pass and yield nothing
on a second pass.

#### Parameters

##### source

`Iterable`\<`T`\>

Any `Iterable<T>` — arrays, Sets, Maps, generators,
  or any object implementing `[Symbol.iterator]`.

#### Returns

`LazyCollection`\<`T`\>

#### Example

```ts
const col = new LazyCollection(new Set([1, 2, 3]));
// or via the factory:
const col = collect(new Set([1, 2, 3]));
```

#### Inherited from

`Enumerable<T>.constructor`

## Properties

### \_current

> `protected` **\_current**: `T` \| `undefined`

Defined in: [core/engines/sync/lazy-collection.ts:62](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L62)

**`Internal`**

The most recently yielded element, or `undefined` before iteration.

***

### \_processed

> `protected` **\_processed**: `number` = `0`

Defined in: [core/engines/sync/lazy-collection.ts:55](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L55)

**`Internal`**

Number of elements successfully pulled from the source.
Incremented by one for each item yielded during iteration.

***

### \_total

> `protected` **\_total**: `number` \| `null` = `null`

Defined in: [core/engines/sync/lazy-collection.ts:70](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L70)

**`Internal`**

Cached total element count. `null` until the source is fully
traversed or the count is determinable from the source type.

***

### source

> `protected` **source**: `Iterable`\<`T`\>

Defined in: [core/engines/sync/lazy-collection.ts:90](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L90)

Any `Iterable<T>` — arrays, Sets, Maps, generators,
  or any object implementing `[Symbol.iterator]`.

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Generator`\<`T`, `void`, `unknown`\>

Defined in: [core/engines/sync/lazy-collection.ts:320](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L320)

Iterates lazily over elements from the source iterable.

Implements the `Iterable<T>` protocol. Each call creates a fresh
generator that wraps the source — the source itself is iterated
once per call. One-shot generators (e.g. the result of a generator
function) can only be consumed once; passing the same generator
instance to a second `for...of` will yield nothing.

Updates `_current` and `_processed` with each yielded item.

#### Returns

`Generator`\<`T`, `void`, `unknown`\>

#### Yields

Each element `T` in the order produced by the source.

#### Example

```ts
const col = collect(new Set([100, 200, 300]));

for (const item of col) {
  console.log(item); // 100, 200, 300
}
```

#### Inherited from

`Enumerable.[iterator]`

***

### all()

> **all**(): `T`[]

Defined in: [core/engines/sync/lazy-collection.ts:114](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L114)

Eagerly materialises all deferred elements into a plain array.

Triggers full evaluation of the generator pipeline. If the source
is a one-shot generator, subsequent calls to `all()` will return
an empty array — generators are not re-windable. Use a source
that is re-iterable (e.g. a `Set`, or an array wrapped in a
factory function) if you need multiple passes.

#### Returns

`T`[]

A new `T[]` containing every yielded element.

#### Example

```ts
function* range(n: number) {
  for (let i = 0; i < n; i++) yield i;
}

collect(range(5)).all(); // [0, 1, 2, 3, 4]
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`all`](../../../../contracts/enumerable/interfaces/Enumerable.md#all)

***

### count()

> **count**(): `number`

Defined in: [core/engines/sync/lazy-collection.ts:169](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L169)

Returns the total number of elements in the source iterable.

Delegates to `total`. Provided for API symmetry with
`Collection`. See `total()` for detailed behaviour notes.

#### Returns

`number`

The element count as a plain number.

#### Example

```ts
collect(new Set([1, 2, 3])).count(); // 3
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`count`](../../../../contracts/enumerable/interfaces/Enumerable.md#count)

***

### current()

> **current**(): `T` \| `undefined`

Defined in: [core/engines/sync/lazy-collection.ts:224](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L224)

Returns the element at the current iterator cursor position.

Updated with each item yielded during a `for...of` loop.
Returns `undefined` before the first iteration begins.

#### Returns

`T` \| `undefined`

The current element, or `undefined`.

#### Example

```ts
const col = collect(new Set([10, 20, 30]));

for (const item of col) {
  console.log(col.current()); // 10, then 20, then 30
}
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`current`](../../../../contracts/enumerable/interfaces/Enumerable.md#current)

***

### filter()

> **filter**(`fn`): `LazyCollection`\<`T`\>

Defined in: [core/operators/filter.ts:14](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/filter.ts#L14)

🟡 Sync Lazy: Predicate diperiksa saat iterasi berjalan

#### Parameters

##### fn

(`item`) => `boolean`

#### Returns

`LazyCollection`\<`T`\>

#### Inherited from

[`LazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md).[`filter`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md#filter)

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

> **map**\<`U`\>(`fn`): `LazyCollection`\<`U`\>

Defined in: [core/operators/map.ts:11](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/map.ts#L11)

🟡 Sync Lazy — transform via generator, deferred hingga diiterasi

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U`

#### Returns

`LazyCollection`\<`U`\>

#### Inherited from

[`LazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md).[`map`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md#map)

***

### pluck()

> **pluck**\<`K`\>(`key`): `LazyCollection`\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:11](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/pluck.ts#L11)

🟡 Sync Lazy: Pluck via Generator

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

#### Returns

`LazyCollection`\<`T`\[`K`\]\>

#### Inherited from

[`LazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md).[`pluck`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md#pluck)

***

### processed()

> **processed**(): `number`

Defined in: [core/engines/sync/lazy-collection.ts:292](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L292)

Returns the number of elements consumed so far.

Incremented by one for each item yielded during `for...of`.
After a full pass equals `total()`. Unlike `Collection`,
this is not reset between passes on lazy collections — each
call to `all()` accumulates into this counter.

#### Returns

`number`

The processed element count as a plain number.

#### Example

```ts
const col = collect([1, 2, 3]);
for (const _ of col) { break; } // exits after first item
col.processed(); // 1
```

***

### progress()

> **progress**(): `number`

Defined in: [core/engines/sync/lazy-collection.ts:269](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L269)

Returns the percentage of elements yielded in the current pass (0–100).

Returns `0` if total is zero or not yet known.

#### Returns

`number`

An integer between `0` and `100` inclusive.

#### Example

```ts
const col = collect([1, 2, 3, 4]);
let i = 0;

for (const _ of col) {
  if (++i === 3) console.log(col.progress()); // 75
}
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`progress`](../../../../contracts/enumerable/interfaces/Enumerable.md#progress)

***

### remaining()

> **remaining**(): `number` \| `null`

Defined in: [core/engines/sync/lazy-collection.ts:248](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L248)

Returns the number of elements not yet consumed by the current pass.

Calls `total` internally — be aware this may trigger a full
source traversal if the total is not yet cached. Returns `null`
if `total()` cannot determine the count without exhausting the source
(this case does not arise in the current implementation, but subclasses
may override `total()` to return a sentinel).

#### Returns

`number` \| `null`

The remaining element count, or `null` if unknown.

#### Example

```ts
const col = collect(new Set([1, 2, 3, 4]));

for (const _ of col) {
  console.log(col.remaining()); // 3, 2, 1, 0
}
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`remaining`](../../../../contracts/enumerable/interfaces/Enumerable.md#remaining)

***

### take()

> **take**(`limit`): `LazyCollection`\<`T`\>

Defined in: [core/operators/take.ts:11](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/take.ts#L11)

🟡 Sync Lazy: Berhenti iterasi tepat setelah limit tercapai

#### Parameters

##### limit

`number`

#### Returns

`LazyCollection`\<`T`\>

#### Inherited from

[`LazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md).[`take`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md#take)

***

### tap()

> **tap**(`fn`): `LazyCollection`\<`T`\>

Defined in: [core/operators/tap.ts:11](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/tap.ts#L11)

🟡 Sync Lazy: Intip data saat iterasi berjalan

#### Parameters

##### fn

(`item`) => `void`

#### Returns

`LazyCollection`\<`T`\>

#### Inherited from

[`LazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md).[`tap`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md#tap)

***

### toArray()

> **toArray**(): `T`[]

Defined in: [core/engines/sync/lazy-collection.ts:132](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L132)

Alias for `all`. Materialises all elements into a plain array.

#### Returns

`T`[]

A new `T[]` containing every element.

#### Example

```ts
collect(new Map([['a', 1], ['b', 2]])).toArray();
// [['a', 1], ['b', 2]]
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`toArray`](../../../../contracts/enumerable/interfaces/Enumerable.md#toarray)

***

### toJSON()

> **toJSON**(): `T`[]

Defined in: [core/engines/sync/lazy-collection.ts:150](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L150)

Serialises the collection to a plain array for `JSON.stringify`.

Called automatically by `JSON.stringify`. Delegates to `all`
so the output is identical to a full materialisation.

#### Returns

`T`[]

A new `T[]` in iteration order.

#### Example

```ts
JSON.stringify(collect(new Set([1, 2, 3])));
// '[1,2,3]'
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`toJSON`](../../../../contracts/enumerable/interfaces/Enumerable.md#tojson)

***

### toString()

> **toString**(): `string`

Defined in: [core/engines/sync/lazy-collection.ts:348](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L348)

Returns a human-readable label for logging and assertion messages.

Format: `"[NodeCollections::LazyCollection (Pulled: {n})]"`.

#### Returns

`string`

The string label.

#### Example

```ts
const col = collect(new Set([1, 2, 3]));
col.toString();
// "[NodeCollections::LazyCollection (Pulled: 0)]"
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`toString`](../../../../contracts/enumerable/interfaces/Enumerable.md#tostring)

***

### total()

> **total**(): `number`

Defined in: [core/engines/sync/lazy-collection.ts:197](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/sync/lazy-collection.ts#L197)

Returns the total number of elements in the source iterable.

Resolution strategy (in order):
1. Returns the cached `_total` if the source has already been traversed.
2. Returns `source.length` for arrays (O(1)).
3. Returns `source.size` for `Set` and `Map` (O(1)).
4. **Fully traverses** the source to count elements (O(n)) and caches
   the result. Note: this exhausts one-shot generators.

#### Returns

`number`

The element count as a plain number.

#### Remarks

Calling `total()` on an exhausted generator returns the
cached count from the previous traversal — it does not re-traverse.

#### Example

```ts
collect([1, 2, 3, 4, 5]).total(); // 5  — O(1)
collect(new Set([1, 2, 3])).total(); // 3  — O(1)

function* gen() { yield 1; yield 2; }
collect(gen()).total(); // 2  — O(n), traverses generator
```

#### Inherited from

[`Enumerable`](../../../../contracts/enumerable/interfaces/Enumerable.md).[`total`](../../../../contracts/enumerable/interfaces/Enumerable.md#total)

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): `LazyCollection`\<`T`\>

Defined in: [core/operators/where.ts:39](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L39)

🟡 Sync Lazy: Filter via generator

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### value

`T`\[`K`\]

##### Returns

`LazyCollection`\<`T`\>

##### Inherited from

[`LazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md).[`where`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md#where)

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): `LazyCollection`\<`T`\>

Defined in: [core/operators/where.ts:40](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L40)

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

`LazyCollection`\<`T`\>

##### Inherited from

[`LazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md).[`where`](../../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md#where)
