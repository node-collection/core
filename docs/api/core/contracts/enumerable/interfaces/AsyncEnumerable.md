[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: AsyncEnumerable\<T\>

Defined in: [core/contracts/enumerable.ts:352](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L352)

Base contract for all **asynchronous** collection engines.

Extends the native `AsyncIterable<T>` protocol, enabling `for await...of`
loops, `Symbol.asyncIterator`, and async spread patterns.

All terminal methods return Promises. Settlement-tracking methods
(`resolved`, `rejected`, `errors`) are **synchronous** — they reflect
the state accumulated so far and are safe to call mid-iteration.

## See

 - `AsyncCollection`
 - `AsyncLazyCollection`

## Extends

- `AsyncIterable`\<`T`\>.[`BaseEnumerable`](BaseEnumerable.md)\<`T`\>

## Extended by

- [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)
- [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)

## Type Parameters

### T

`T`

The resolved value type held by the collection.

## Methods

### all()

> **all**(): `Promise`\<`T`[]\>

Defined in: [core/contracts/enumerable.ts:376](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L376)

Resolves and materialises all fulfilled items into a plain array.

For eager collections, this triggers `Promise.allSettled` on the
internal promise array. For lazy collections, this drains the async
iterable. Rejected promises are silently collected in `errors`;
only fulfilled values are included in the result.

The result is cached after the first call — safe to `await` multiple times.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` resolving to all fulfilled values in input order.

#### Example

```ts
const users = await collect([
  fetchUser(1),
  fetchUser(2),
  Promise.reject(new Error('not found')),
]).all();

// users = [User, User]  — the rejection is captured in errors()
```

***

### count()

> **count**(): `Promise`\<`number`\>

Defined in: [core/contracts/enumerable.ts:415](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L415)

Returns the count of fulfilled items.

Triggers settlement if the collection has not yet been resolved.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to the fulfilled item count.

#### Example

```ts
const n = await collect([fetchUser(1), fetchUser(2)]).count();
// 2
```

***

### current()

> **current**(): `Promise`\<`T`\>

Defined in: [core/contracts/enumerable.ts:435](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L435)

Returns the item at the current iterator cursor position.

Safe to call mid `for await...of` loop to inspect the most recently
yielded item. Returns `undefined` before iteration begins.

#### Returns

`Promise`\<`T`\>

A `Promise<T>` resolving to the current item.

#### Example

```ts
const col = collect([fetchUser(1), fetchUser(2)]);

for await (const user of col) {
  const same = await col.current();
  console.log(same === user); // true
}
```

***

### errors()

> **errors**(): `Error`[]

Defined in: [core/contracts/enumerable.ts:568](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L568)

Returns all errors collected from rejected Promises.

Synchronous — returns a shallow copy of the internal error buffer.
Mutations to the returned array do not affect the collection's
internal state. The array is ordered by input position.

#### Returns

`Error`[]

A `Error[]` shallow copy of accumulated rejection errors.

#### Example

```ts
const col = collect([
  fetchUser(1),
  Promise.reject(new Error('404 Not Found')),
  Promise.reject(new Error('503 Unavailable')),
]);
await col.all();

col.errors().forEach(err => console.error(err.message));
// "404 Not Found"
// "503 Unavailable"
```

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

***

### progress()

> **progress**(): `Promise`\<`number`\>

Defined in: [core/contracts/enumerable.ts:498](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L498)

Returns the percentage of items yielded in the current pass (0–100).

Calculated as `Math.round((cursor / total) * 100)`.
Returns `0` when the total is unknown or zero.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to an integer between `0` and `100`.

#### Example

```ts
const col = collect([p1, p2, p3, p4]);
let i = 0;

for await (const _ of col) {
  if (++i === 2) console.log(await col.progress()); // 50
}
```

***

### rejected()

> **rejected**(): `number`

Defined in: [core/contracts/enumerable.ts:543](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L543)

Returns the count of Promises that have rejected.

Synchronous — safe to call at any point after resolution begins.
Pairs with `errors` to retrieve the actual failure reasons.

#### Returns

`number`

The number of rejected Promises as a plain number.

#### Example

```ts
const col = collect([
  Promise.resolve('ok'),
  Promise.reject(new Error('timeout')),
]);
await col.all();

col.rejected(); // 1
col.errors();   // [Error: timeout]
```

***

### remaining()

> **remaining**(): `Promise`\<`number`\>

Defined in: [core/contracts/enumerable.ts:478](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L478)

Returns the number of items not yet yielded by the current pass.

For lazy collections whose total is not yet known, returns `0`
rather than draining the source implicitly. Call `total` first
if you need an accurate figure before iteration.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to the remaining item count.

#### Example

```ts
const col = collect([p1, p2, p3, p4]);
await col.all();

let count = 0;
for await (const _ of col) {
  count++;
  if (count === 2) {
    console.log(await col.remaining()); // 2
  }
}
```

***

### resolved()

> **resolved**(): `number`

Defined in: [core/contracts/enumerable.ts:521](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L521)

Returns the count of Promises that have fulfilled.

This is a **synchronous** method — it reflects the settlement
state accumulated so far without triggering further resolution.

#### Returns

`number`

The number of fulfilled Promises as a plain number.

#### Remarks

The method name preserves an intentional typo from the
original contract. Use alongside `rejected` and `errors`
to implement retry or error-reporting logic.

#### Example

```ts
const col = collect([Promise.resolve(1), Promise.reject(new Error('x'))]);
await col.all();

col.resolved(); // 1
col.rejected();  // 1
```

***

### toArray()

> **toArray**(): `Promise`\<`T`[]\>

Defined in: [core/contracts/enumerable.ts:400](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L400)

Alias for `all`. Drains the async iterable into a plain array.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` of all fulfilled values.

#### Example

```ts
const arr = await collect(asyncGenerator()).toArray();
```

***

### toJSON()

> **toJSON**(): `Promise`\<`T`[]\>

Defined in: [core/contracts/enumerable.ts:388](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L388)

Alias for `all`. Used by `JSON.stringify` for async serialisation.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` of all fulfilled values.

#### Example

```ts
const json = JSON.stringify(await collect([p1, p2]).toJSON());
```

***

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

#### Inherited from

[`BaseEnumerable`](BaseEnumerable.md).[`toString`](BaseEnumerable.md#tostring)

***

### total()

> **total**(): `Promise`\<`number`\>

Defined in: [core/contracts/enumerable.ts:453](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L453)

Returns the total number of inputs (fulfilled + rejected).

For eager collections backed by `Promise<T>[]`, this is known
synchronously from construction and resolves immediately.
For lazy collections backed by an async generator, this requires
a full drain of the source.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to the total input count.

#### Example

```ts
const col = collect([p1, p2, p3]);
const total = await col.total(); // 3
```
