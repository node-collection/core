[**Node Collections API v1.0.0**](../../../../../index.md)

***

# Class: AsyncLazyCollection\<T\>

Defined in: [core/engines/async/async-lazy-collection.ts:4](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L4)

A lazy, asynchronous collection backed by any `AsyncIterable<T>`.

Items are pulled on-demand — nothing executes until you iterate with
`for await...of` or call `all`. Operator chains compose async
generators transparently, keeping memory usage constant relative to
the number of concurrently in-flight items rather than the total
dataset size.

`AsyncLazyCollection` is the natural fit for:
- Node.js `Readable` streams and `stream.pipeline` sources.
- Paginated API cursors that yield pages on demand.
- Infinite async sequences (e.g. event emitters, message queues).
- Any pipeline where you want to process-and-discard items rather
  than buffer the full result set.

Settlement tracking (`_resolvedCount`, `_rejectedCount`, `_errors`)
is updated **incrementally** as items are yielded, making it safe
to call `resolved`, `rejected`, and `errors`
mid-iteration to check pipeline health without waiting for completion.

## See

 - `collect` — preferred factory function
 - `AsyncCollection` — eager async alternative
 - `LazyCollection` — lazy sync counterpart

## Example

```ts
async function* paginate(endpoint: string) {
  let cursor: string | null = 'start';
  while (cursor) {
    const { items, nextCursor } = await fetch(`${endpoint}?cursor=${cursor}`)
      .then(r => r.json());
    yield* items;
    cursor = nextCursor ?? null;
  }
}

for await (const record of collect(paginate('/api/records')).map(transform)) {
  await save(record);
  console.log(`Saved ${col.resolved()} records so far`);
}
```

## Extends

- [`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md)\<`T`\>.[`AsyncLazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md)\<`T`\>

## Type Parameters

### T

`T`

The type of values yielded by the async iterable.

## Constructors

### Constructor

> **new AsyncLazyCollection**\<`T`\>(`source`): `AsyncLazyCollection`\<`T`\>

Defined in: [core/engines/async/async-lazy-collection.ts:120](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L120)

Creates a new `AsyncLazyCollection` wrapping the given async iterable.

The source is **not consumed** on construction — no items are pulled
until the first `await iter.next()`. If the source is a one-shot async
generator, it can only be iterated once; a second `for await...of`
will yield nothing.

#### Parameters

##### source

`AsyncIterable`\<`T`\>

Any `AsyncIterable<T>` — async generators, Node.js
  Readable streams (in object mode), `ReadableStream`, or any object
  implementing `[Symbol.asyncIterator]`.

#### Returns

`AsyncLazyCollection`\<`T`\>

#### Example

```ts
async function* gen() { yield 1; yield 2; yield 3; }

const col = new AsyncLazyCollection(gen());
// or via the factory:
const col = collect(gen());
```

#### Inherited from

`AsyncEnumerable<T>.constructor`

## Properties

### \_current

> `protected` **\_current**: `T` \| `undefined`

Defined in: [core/engines/async/async-lazy-collection.ts:67](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L67)

**`Internal`**

The most recently yielded item. `undefined` before iteration.

***

### \_errors

> `protected` **\_errors**: `Error`[] = `[]`

Defined in: [core/engines/async/async-lazy-collection.ts:97](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L97)

**`Internal`**

Errors thrown by the source during async iteration.

***

### \_processed

> `protected` **\_processed**: `number` = `0`

Defined in: [core/engines/async/async-lazy-collection.ts:60](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L60)

**`Internal`**

Number of items successfully pulled and yielded from the source.
Incremented by one per yield inside the async iterator.

***

### \_rejectedCount

> `protected` **\_rejectedCount**: `number` = `0`

Defined in: [core/engines/async/async-lazy-collection.ts:90](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L90)

**`Internal`**

Number of errors encountered during async iteration.

***

### \_resolvedCount

> `protected` **\_resolvedCount**: `number` = `0`

Defined in: [core/engines/async/async-lazy-collection.ts:83](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L83)

**`Internal`**

Number of items successfully yielded (mirrors `_processed`).
Maintained separately to clearly express settlement semantics.

***

### \_total

> `protected` **\_total**: `number` \| `null` = `null`

Defined in: [core/engines/async/async-lazy-collection.ts:75](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L75)

**`Internal`**

Cached total element count. `null` until the source is fully drained.
Set at the end of a complete iteration pass.

***

### source

> `protected` **source**: `AsyncIterable`\<`T`\>

Defined in: [core/engines/async/async-lazy-collection.ts:120](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L120)

Any `AsyncIterable<T>` — async generators, Node.js
  Readable streams (in object mode), `ReadableStream`, or any object
  implementing `[Symbol.asyncIterator]`.

## Methods

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncGenerator`\<`T`, `void`, `unknown`\>

Defined in: [core/engines/async/async-lazy-collection.ts:156](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L156)

Async-iterates over elements from the source one at a time.

Each item is pulled lazily — only the item currently being processed
occupies working memory at any given moment. Operator pipelines composed
via `defineOperator` stack as async generator wrappers, so the pull-based
nature is preserved end-to-end.

Updates `_current`, `_processed`, and `_resolvedCount` with each
successful yield. Captures errors in `_rejectedCount` and `_errors`,
then re-throws so the caller's `try/catch` or stream error handler
can respond.

When the source is fully exhausted, `_total` is set to `_processed`
so that subsequent calls to `total` and `progress` return
accurate figures without re-traversing.

#### Returns

`AsyncGenerator`\<`T`, `void`, `unknown`\>

#### Yields

Each item `T` as it is pulled from the source.

#### Throws

Re-throws any error raised by the source during iteration.

#### Example

```ts
async function* gen() { yield 'a'; yield 'b'; yield 'c'; }

const col = collect(gen());

for await (const item of col) {
  console.log(item); // 'a', 'b', 'c'
}
```

#### Inherited from

`AsyncEnumerable.[asyncIterator]`

***

### all()

> **all**(): `Promise`\<`T`[]\>

Defined in: [core/engines/async/async-lazy-collection.ts:196](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L196)

Eagerly drains the async iterable into a plain array.

Passes through `this[Symbol.asyncIterator]()` so that all tracking state
(`_processed`, `_resolvedCount`, `_total`) is correctly populated after
the drain completes. After `all()` returns, `total` and
`progress` will return accurate figures.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` that resolves after every item has been yielded.

#### Remarks

**Do not call on infinite sequences** — this method will never
resolve if the source never completes. For infinite sources, consume
items via `for await...of` and `break` when done.

#### Example

```ts
async function* gen() { yield 100; yield 200; yield 300; }

const items = await collect(gen()).all();
// [100, 200, 300]
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`all`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#all)

***

### count()

> **count**(): `Promise`\<`number`\>

Defined in: [core/engines/async/async-lazy-collection.ts:245](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L245)

Returns the total number of elements yielded by the source.

Delegates to `total`. Use `count()` when the semantic intent
is "how many items were there" and `total()` when framing throughput.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to the element count.

#### Example

```ts
await collect(gen()).count(); // drains source if not yet consumed
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`count`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#count)

***

### current()

> **current**(): `Promise`\<`T`\>

Defined in: [core/engines/async/async-lazy-collection.ts:295](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L295)

Returns the most recently yielded item during async iteration.

Returns `undefined` before the first yield. Safe to call mid
`for await...of` loop.

#### Returns

`Promise`\<`T`\>

A `Promise<T>` resolving to the current item.

#### Example

```ts
const col = collect(gen());

for await (const item of col) {
  const same = await col.current();
  console.log(same === item); // true
}
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`current`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#current)

***

### errors()

> **errors**(): `Error`[]

Defined in: [core/engines/async/async-lazy-collection.ts:424](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L424)

Returns all errors thrown by the source during async iteration.

**Synchronous** — returns a **shallow copy** of the internal error buffer.
Mutations to the returned array do not affect the collection's internal
state.

#### Returns

`Error`[]

A `Error[]` shallow copy of all iteration errors.

#### Example

```ts
try {
  await collect(flakyStream()).all();
} catch {
  col.errors().forEach(e => logger.error(e));
}
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`errors`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#errors)

***

### filter()

> **filter**(`fn`): `AsyncLazyCollection`\<`T`\>

Defined in: [core/operators/filter.ts:22](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/filter.ts#L22)

🟣 Async Lazy: Stream filter via Async Generator

#### Parameters

##### fn

(`item`) => `boolean` \| `Promise`\<`boolean`\>

#### Returns

`AsyncLazyCollection`\<`T`\>

#### Inherited from

[`AsyncLazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md).[`filter`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md#filter)

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

> **map**\<`U`\>(`fn`): `AsyncLazyCollection`\<`U`\>

Defined in: [core/operators/map.ts:19](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/map.ts#L19)

🟣 Async Lazy — transform via async generator, deferred hingga diiterasi

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U` \| `Promise`\<`U`\>

#### Returns

`AsyncLazyCollection`\<`U`\>

#### Inherited from

[`AsyncLazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md).[`map`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md#map)

***

### pluck()

> **pluck**\<`K`\>(`key`): `AsyncLazyCollection`\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:19](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/pluck.ts#L19)

🟣 Async Lazy: Pluck dari Stream

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

#### Returns

`AsyncLazyCollection`\<`T`\[`K`\]\>

#### Inherited from

[`AsyncLazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md).[`pluck`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md#pluck)

***

### progress()

> **progress**(): `Promise`\<`number`\>

Defined in: [core/engines/async/async-lazy-collection.ts:345](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L345)

Returns the percentage of items yielded relative to the known total (0–100).

Returns `0` if the total is not yet known or is zero.
Becomes meaningful after a full drain or on a second iteration pass
(when `_total` is cached from the first pass).

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to an integer between `0` and `100`.

#### Example

```ts
const col = collect(gen()); // 4 items
await col.all();            // populate _total = 4

let i = 0;
for await (const _ of col) {
  if (++i === 2) console.log(await col.progress()); // 50
}
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`progress`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#progress)

***

### rejected()

> **rejected**(): `number`

Defined in: [core/engines/async/async-lazy-collection.ts:402](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L402)

Returns the number of errors encountered during async iteration.

**Synchronous** — a single error thrown by the source increments this
by `1` and halts the pipeline (the error is re-thrown). Call after
a `try/catch` around your iteration loop to inspect the failure count.

#### Returns

`number`

The rejection count as a plain number.

#### Example

```ts
const col = collect(flakyStream());

try {
  for await (const item of col) {
    process(item);
  }
} catch {
  console.error(`Failed after ${col.resolved()} items, ${col.rejected()} errors`);
  console.error(col.errors()[0]);
}
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`rejected`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#rejected)

***

### remaining()

> **remaining**(): `Promise`\<`number`\>

Defined in: [core/engines/async/async-lazy-collection.ts:320](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L320)

Returns the number of items not yet yielded relative to the known total.

Returns `0` if the total is not yet known (i.e. the source has not been
fully drained). This is intentional — `remaining()` will **not** implicitly
drain the source to compute an accurate figure. If you need the value
before a full drain, call `await col.total()` first.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to the remaining count,
  or `0` if the total is unknown.

#### Example

```ts
const col = collect(gen());
await col.all(); // drain to populate _total

for await (const _ of col) {
  console.log(await col.remaining()); // decrements per item
}
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`remaining`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#remaining)

***

### resolved()

> **resolved**(): `number`

Defined in: [core/engines/async/async-lazy-collection.ts:375](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L375)

Returns the number of items successfully yielded so far.

**Synchronous** — incremented per item during iteration. Safe to call
mid `for await...of` loop to monitor pipeline throughput in real time.

#### Returns

`number`

The fulfilled item count as a plain number.

#### Remarks

The method name preserves an intentional typo in the
`AsyncEnumerable` contract.

#### Example

```ts
const col = collect(paginate('/api/records'));

for await (const record of col) {
  await save(record);
  if (col.resolved() % 100 === 0) {
    console.log(`Processed ${col.resolved()} records`);
  }
}
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`resolved`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#resolved)

***

### take()

> **take**(`limit`): `AsyncLazyCollection`\<`T`\>

Defined in: [core/operators/take.ts:19](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/take.ts#L19)

🟣 Async Lazy: Berhenti tarik data dari stream setelah limit tercapai

#### Parameters

##### limit

`number`

#### Returns

`AsyncLazyCollection`\<`T`\>

#### Inherited from

[`AsyncLazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md).[`take`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md#take)

***

### tap()

> **tap**(`fn`): `AsyncLazyCollection`\<`T`\>

Defined in: [core/operators/tap.ts:19](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/tap.ts#L19)

🟣 Async Lazy: Intip data dari stream asinkron

#### Parameters

##### fn

(`item`) => `void` \| `Promise`\<`void`\>

#### Returns

`AsyncLazyCollection`\<`T`\>

#### Inherited from

[`AsyncLazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md).[`tap`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md#tap)

***

### toArray()

> **toArray**(): `Promise`\<`T`[]\>

Defined in: [core/engines/async/async-lazy-collection.ts:212](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L212)

Alias for `all`. Drains the async iterable into a plain array.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` of all yielded items.

#### Example

```ts
const arr = await collect(asyncReadableStream()).toArray();
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`toArray`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#toarray)

***

### toJSON()

> **toJSON**(): `Promise`\<`T`[]\>

Defined in: [core/engines/async/async-lazy-collection.ts:226](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L226)

Alias for `all`. Called automatically by `JSON.stringify`.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` of all yielded items.

#### Example

```ts
const json = JSON.stringify(await collect(gen()).toJSON());
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`toJSON`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#tojson)

***

### toString()

> **toString**(): `string`

Defined in: [core/engines/async/async-lazy-collection.ts:444](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L444)

Returns a human-readable label for logging and assertion messages.

Format: `"[NodeCollections::AsyncLazyCollection (Pulled: {n}, Errors: {m})]"`.

#### Returns

`string`

The string label.

#### Example

```ts
const col = collect(gen());
col.toString();
// "[NodeCollections::AsyncLazyCollection (Pulled: 0, Errors: 0)]"
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`toString`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#tostring)

***

### total()

> **total**(): `Promise`\<`number`\>

Defined in: [core/engines/async/async-lazy-collection.ts:271](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/engines/async/async-lazy-collection.ts#L271)

Returns the total number of elements in the source.

- If the source has been **fully consumed** (via `all` or a
  completed `for await...of`), returns the cached `_total` immediately.
- Otherwise, **drains the source** to determine the count, setting
  `_total` for future calls.

#### Returns

`Promise`\<`number`\>

A `Promise<number>` resolving to the exact element count.

#### Remarks

**Calling `total()` mid-stream on a one-shot generator will
consume and exhaust it**, leaving nothing for subsequent iteration.
Only call `total()` upfront if the source is re-iterable (e.g. a
Node.js stream that can be recreated), or after a full drain.

#### Example

```ts
const col = collect(gen());
await col.all();       // drain first
await col.total();     // returns cached count immediately
```

#### Inherited from

[`AsyncEnumerable`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md).[`total`](../../../../contracts/enumerable/interfaces/AsyncEnumerable.md#total)

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): `AsyncLazyCollection`\<`T`\>

Defined in: [core/operators/where.ts:49](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L49)

🟣 Async Lazy: Filter stream

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### value

`T`\[`K`\]

##### Returns

`AsyncLazyCollection`\<`T`\>

##### Inherited from

[`AsyncLazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md).[`where`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md#where)

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): `AsyncLazyCollection`\<`T`\>

Defined in: [core/operators/where.ts:50](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L50)

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

`AsyncLazyCollection`\<`T`\>

##### Inherited from

[`AsyncLazyEnumerableMethods`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md).[`where`](../../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md#where)
