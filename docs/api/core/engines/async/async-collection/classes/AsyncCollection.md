[**Node Collections API v1.0.0**](../../../../../index.md)

***

# Class: AsyncCollection\<T\>

Defined in: [core/engines/async/async-collection.ts:4](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L4)

An eager, asynchronous collection backed by an array of Promises.

All Promises are settled concurrently via `Promise.allSettled`, preserving
input order regardless of resolution time. Partial success is the default
semantics — if some Promises reject, the fulfilled values are still
accessible via `all`, while rejections are captured in `errors`.

Resolution is **lazy-cached** — the first call to `all`, `toArray`,
or the async iterator triggers settlement; every subsequent call reuses
the cached result without re-resolving the original Promises.

Operator chains registered via `defineOperator` return a new
`AsyncCollection` synchronously (wrapping a `Promise<T[]>`) so the
fluent API remains chainable. Only terminal methods trigger actual
Promise settlement.

Choose `AsyncCollection` when:
- You have a fixed array of Promises to resolve concurrently.
- You need partial-success semantics (failed Promises should not abort
  the entire pipeline).
- You want to inspect `rejected()` and `errors()` after resolution.

For unbounded or streaming async data, prefer `AsyncLazyCollection`.

## See

 - `collect` — preferred factory function
 - `AsyncLazyCollection` — lazy async alternative

## Example

```ts
const col = collect([
  fetch('/api/users/1').then(r => r.json()),
  fetch('/api/users/2').then(r => r.json()),
  Promise.reject(new Error('403 Forbidden')),
]);

const users = await col.all();
// [{ id: 1, ... }, { id: 2, ... }]  — partial success

col.rejected(); // 1
col.errors();   // [Error: 403 Forbidden]
```

## Extends

- [`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md)\<`T`\>.[`AsyncEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md)\<`T`\>

## Type Parameters

### T

`T`

The resolved value type of each Promise.

## Constructors

### Constructor

> **new AsyncCollection**\<`T`\>(`items`): `AsyncCollection`\<`T`\>

Defined in: [core/engines/async/async-collection.ts:127](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L127)

Creates a new `AsyncCollection` from an array of Promises
or a pre-resolved `Promise<T[]>`.

Passing a `Promise<T[]>` (produced by operator chains like `map`)
avoids wrapping an already-resolved array in a redundant `Promise.allSettled`.
The concrete input type is detected internally via `instanceof Promise`.

For `Promise<T>[]` inputs, `_total` is set synchronously from the array
length so that `total` and `remaining` can return meaningful
values before settlement completes.

#### Parameters

##### items

`Promise`\<`T`[]\> \| `Promise`\<`T`\>[]

An array of `Promise<T>` or a single `Promise<T[]>`.

#### Returns

`AsyncCollection`\<`T`\>

#### Example

```ts
// From individual Promises:
const col = new AsyncCollection([fetchUser(1), fetchUser(2)]);

// Via the factory (preferred):
const col = collect([fetchUser(1), fetchUser(2)]);
```

#### Inherited from

`AsyncEnumerable<T>.constructor`

## Properties

### items

> `protected` **items**: `Promise`\<`T`[]\> \| `Promise`\<`T`\>[]

Defined in: [core/engines/async/async-collection.ts:127](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L127)

An array of `Promise<T>` or a single `Promise<T[]>`.

## Methods

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncGenerator`\<`T`, `void`, `unknown`\>

Defined in: [core/engines/async/async-collection.ts:211](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L211)

Async-iterates over all resolved values in input order.

Triggers settlement on the first call via `_settle`. Subsequent
`for await...of` loops replay items from the cache without re-resolving
the original Promises. The cursor resets to `0` at the start of each pass.

#### Returns

`AsyncGenerator`\<`T`, `void`, `unknown`\>

#### Yields

Each fulfilled value `T` in input order.

#### Example

```ts
const col = collect([Promise.resolve(1), Promise.resolve(2)]);

for await (const item of col) {
  console.log(item); // 1, then 2
}

// Safe to iterate again — replays from cache:
for await (const item of col) {
  console.log(item); // 1, then 2
}
```

#### Inherited from

`AsyncEnumerable.[asyncIterator]`

***

### all()

> **all**(): `Promise`\<`T`[]\>

Defined in: [core/engines/async/async-collection.ts:252](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L252)

Settles and materialises all fulfilled Promises into a plain array.

Uses `Promise.allSettled` internally — rejected Promises do not abort
the pipeline. Fulfilled values are returned in input order; rejections
are collected silently and accessible via `rejected` and `errors`.

The result is **memoised** — calling `all()` multiple times is safe and
cheap after the first resolution.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` resolving to all fulfilled values.

#### Example

```ts
const col = collect([
  Promise.resolve('alpha'),
  Promise.reject(new Error('network error')),
  Promise.resolve('gamma'),
]);

await col.all();    // ['alpha', 'gamma']
col.rejected();     // 1
col.errors()[0];    // Error: network error
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`all`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#all)

***

### count()

> **count**(): `Promise`\<`number`\>

Defined in: [core/engines/async/async-collection.ts:323](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L323)

Returns the count of fulfilled items.

Triggers settlement if the collection has not yet resolved.
Alias for `total()` after resolution — both return the same
value when there are no rejections.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to the fulfilled item count.

#### Example

```ts
const col = collect([Promise.resolve(1), Promise.resolve(2)]);
await col.count(); // 2
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`count`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#count)

***

### current()

> **current**(): `Promise`\<`T`\>

Defined in: [core/engines/async/async-collection.ts:345](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L345)

Returns the most recently yielded item during async iteration.

Returns `undefined` before iteration begins. Safe to call at any
point mid `for await...of` loop.

#### Returns

`Promise`\<`T`\>

A `Promise<T>` resolving to the current item.

#### Example

```ts
const col = collect([Promise.resolve('a'), Promise.resolve('b')]);

for await (const item of col) {
  const current = await col.current();
  console.log(current === item); // true
}
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`current`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#current)

***

### errors()

> **errors**(): `Error`[]

Defined in: [core/engines/async/async-collection.ts:468](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L468)

Returns all errors collected from rejected Promises.

**Synchronous** — returns a **shallow copy** of the internal error buffer.
Mutations to the returned array do not affect the collection. Errors are
ordered by input position, not by rejection time.

#### Returns

`Error`[]

A `Error[]` shallow copy of all rejection errors.

#### Example

```ts
const col = collect([
  fetchUser(1),
  Promise.reject(new Error('404 Not Found')),
  Promise.reject(new TypeError('invalid response')),
]);
await col.all();

col.errors().forEach(e => console.error(e.message));
// "404 Not Found"
// "invalid response"
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`errors`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#errors)

***

### filter()

> **filter**(`fn`): `AsyncCollection`\<`T`\>

Defined in: [core/operators/filter.ts:18](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/filter.ts#L18)

🔵 Async Eager: Filter list of Promises (Awaited)

#### Parameters

##### fn

(`item`) => `boolean` \| `Promise`\<`boolean`\>

#### Returns

`AsyncCollection`\<`T`\>

#### Inherited from

[`AsyncEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md).[`filter`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md#filter)

***

### first()

> **first**(`fn?`): `Promise`\<`T` \| `null`\>

Defined in: [core/operators/first.ts:11](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/first.ts#L11)

🔵 Async: Ambil item pertama secara async

#### Parameters

##### fn?

(`item`) => `boolean` \| `Promise`\<`boolean`\>

#### Returns

`Promise`\<`T` \| `null`\>

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`first`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#first)

***

### map()

> **map**\<`U`\>(`fn`): `AsyncCollection`\<`U`\>

Defined in: [core/operators/map.ts:15](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/map.ts#L15)

🔵 Async Eager — transform list of Promises secara concurrent

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U` \| `Promise`\<`U`\>

#### Returns

`AsyncCollection`\<`U`\>

#### Inherited from

[`AsyncEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md).[`map`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md#map)

***

### pluck()

> **pluck**\<`K`\>(`key`): `AsyncCollection`\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:15](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/pluck.ts#L15)

🔵 Async Eager: Pluck dari list of Promises

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

#### Returns

`AsyncCollection`\<`T`\[`K`\]\>

#### Inherited from

[`AsyncEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md).[`pluck`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md#pluck)

***

### progress()

> **progress**(): `Promise`\<`number`\>

Defined in: [core/engines/async/async-collection.ts:391](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L391)

Returns the percentage of items yielded in the current pass (0–100).

Calculated as `Math.round((cursor / total) * 100)`.
Returns `0` when total is `0`.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to an integer between `0` and `100`.

#### Example

```ts
const col = collect([p1, p2, p3, p4]);
let i = 0;

for await (const _ of col) {
  if (++i === 1) console.log(await col.progress()); // 25
}
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`progress`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#progress)

***

### rejected()

> **rejected**(): `number`

Defined in: [core/engines/async/async-collection.ts:441](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L441)

Returns the count of Promises that have rejected.

**Synchronous** — safe to call at any point after `all` completes.
Pair with `errors` to retrieve the actual failure reasons.

#### Returns

`number`

The rejected Promise count as a plain number.

#### Example

```ts
const col = collect([
  Promise.resolve('ok'),
  Promise.reject(new Error('timeout')),
]);
await col.all();
col.rejected(); // 1
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`rejected`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#rejected)

***

### remaining()

> **remaining**(): `Promise`\<`number`\>

Defined in: [core/engines/async/async-collection.ts:368](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L368)

Returns the number of items not yet consumed by the current pass.

For `Promise<T>[]` inputs, this is computable before settlement because
`_total` is known from the array length. The value decrements with each
yielded item during `for await...of`.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to the remaining item count.

#### Example

```ts
const col = collect([p1, p2, p3, p4]);
let i = 0;

for await (const _ of col) {
  if (++i === 2) console.log(await col.remaining()); // 2
}
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`remaining`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#remaining)

***

### resolved()

> **resolved**(): `number`

Defined in: [core/engines/async/async-collection.ts:419](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L419)

Returns the count of Promises that have fulfilled.

**Synchronous** — reflects accumulated state without triggering
further resolution. Returns `0` before `all` or the async
iterator is first invoked.

#### Returns

`number`

The fulfilled Promise count as a plain number.

#### Remarks

The method name preserves an intentional typo in the
`AsyncEnumerable` contract. See also the `resolved()` alias if
added via module augmentation.

#### Example

```ts
const col = collect([Promise.resolve(1), Promise.resolve(2)]);
await col.all();
col.resolved(); // 2
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`resolved`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#resolved)

***

### take()

> **take**(`limit`): `AsyncCollection`\<`T`\>

Defined in: [core/operators/take.ts:15](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/take.ts#L15)

🔵 Async Eager: Ambil N data pertama dari list of Promises

#### Parameters

##### limit

`number`

#### Returns

`AsyncCollection`\<`T`\>

#### Inherited from

[`AsyncEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md).[`take`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md#take)

***

### tap()

> **tap**(`fn`): `AsyncCollection`\<`T`\>

Defined in: [core/operators/tap.ts:15](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/tap.ts#L15)

🔵 Async Eager: Intip data list of Promises

#### Parameters

##### fn

(`item`) => `void` \| `Promise`\<`void`\>

#### Returns

`AsyncCollection`\<`T`\>

#### Inherited from

[`AsyncEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md).[`tap`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md#tap)

***

### toArray()

> **toArray**(): `Promise`\<`T`[]\>

Defined in: [core/engines/async/async-collection.ts:266](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L266)

Alias for `all`. Materialises fulfilled values as a plain array.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` of all fulfilled values.

#### Example

```ts
const arr = await collect([p1, p2, p3]).toArray();
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`toArray`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#toarray)

***

### toJSON()

> **toJSON**(): `Promise`\<`T`[]\>

Defined in: [core/engines/async/async-collection.ts:280](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L280)

Alias for `all`. Called automatically by `JSON.stringify`.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` of all fulfilled values.

#### Example

```ts
const json = JSON.stringify(await collect([p1, p2]).toJSON());
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`toJSON`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#tojson)

***

### toString()

> **toString**(): `string`

Defined in: [core/engines/async/async-collection.ts:493](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L493)

Returns a human-readable label for logging and assertion messages.

Format: `"[NodeCollections::AsyncCollection ({resolved} resolved,`
`{rejected} rejected / {total} total)]"`.

#### Returns

`string`

The string label.

#### Example

```ts
const col = collect([p1, p2, p3]);
col.toString();
// "[NodeCollections::AsyncCollection (0 resolved, 0 rejected / 3 total)]"

await col.all();
col.toString();
// "[NodeCollections::AsyncCollection (3 resolved, 0 rejected / 3 total)]"
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`toString`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#tostring)

***

### total()

> **total**(): `Promise`\<`number`\>

Defined in: [core/engines/async/async-collection.ts:302](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-collection.ts#L302)

Returns the total number of inputs (fulfilled + rejected).

Triggers settlement if the total is not yet known (e.g. when
constructed with a `Promise<T[]>` from an operator chain).
For `Promise<T>[]` inputs, this resolves immediately without
awaiting any Promises.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to the total input count.

#### Example

```ts
const col = collect([p1, p2, p3]);
await col.total(); // 3  — resolves immediately for Promise<T>[]
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`total`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#total)

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): `AsyncCollection`\<`T`\>

Defined in: [core/operators/where.ts:44](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L44)

🔵 Async Eager: Filter data async

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### value

`T`\[`K`\]

##### Returns

`AsyncCollection`\<`T`\>

##### Inherited from

[`AsyncEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md).[`where`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md#where)

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): `AsyncCollection`\<`T`\>

Defined in: [core/operators/where.ts:45](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L45)

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

`AsyncCollection`\<`T`\>

##### Inherited from

[`AsyncEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md).[`where`](../../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md#where)
