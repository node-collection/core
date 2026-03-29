[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: AsyncLazyEnumerableMethods\<T\>

Defined in: [core/contracts/enumerable.ts:163](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L163)

Extension surface for operators targeting the lazy asynchronous engine.

Plugin authors augment this interface to declare methods injected
onto `AsyncLazyCollection`'s prototype. Operators here compose
async generators — no evaluation happens until iteration begins.

## Example

```ts
declare module '@node-collections/core/contracts/enumerable' {
  interface AsyncLazyEnumerableMethods<T> {
    /**
     * Lazily transforms each item as it is pulled from the source.
     * Evaluation is deferred until `for await...of` or `.all()`.
     *
     * @param fn - A sync or async mapping function.
     * @returns A new deferred `AsyncLazyCollection` of type `U`.
     */
    map<U>(fn: (item: T) => U | Promise<U>): AsyncLazyCollection<U>;
  }
}
```

## See

 - `defineOperator`
 - `AsyncLazyCollection`

## Extended by

- [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)

## Type Parameters

### T

`T`

The element type of the async lazy collection being extended.

## Methods

### filter()

> **filter**(`fn`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/operators/filter.ts:87](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/filter.ts#L87)

Filter elements one-by-one via an asynchronous generator.
* Provides a memory-efficient pipeline that awaits each truth test
before pulling the next item from the source. This prevents overwhelming
external systems with too many concurrent requests.

#### Parameters

##### fn

(`item`) => `boolean` \| `Promise`\<`boolean`\>

The async truth test logic.
- `item`: The current element from the async source.

#### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

A lazy async collection yielding filtered results sequentially.

#### Example

```ts
const stream = collect(largeStream).asyncLazy().filter(async (row) => {
return await db.exists(row.id);
});
// Checks database one-by-one, keeping DB load and memory flat.
```

***

### first()

> **first**(`fn?`): `Promise`\<`T` \| `null`\>

Defined in: [core/operators/first.ts:63](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/first.ts#L63)

Get the first element from an asynchronous stream.
* **Memory Efficient:** Pulls items from the async source one-by-one
and stops the stream as soon as the criteria is met. Ideal for
finding a single record in massive remote datasets or large files.

#### Parameters

##### fn?

(`item`) => `boolean` \| `Promise`\<`boolean`\>

An optional async truth test logic.

#### Returns

`Promise`\<`T` \| `null`\>

A promise resolving to the first match from the stream.

***

### map()

> **map**\<`U`\>(`fn`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`U`\>

Defined in: [core/operators/map.ts:90](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/map.ts#L90)

Transform elements one-by-one via an asynchronous generator.
* This provides a memory-efficient pipeline for async data. It awaits the
transformation of the current item before pulling the next one.

#### Type Parameters

##### U

`U`

The resulting type yielded by the async generator.

#### Parameters

##### fn

(`item`) => `U` \| `Promise`\<`U`\>

The async transformation logic.
- `item`: The current element from the async source.

#### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`U`\>

A lazy async collection yielding results sequentially.

#### Example

```ts
const stream = collect(largeFile)
.asyncLazy()
.map(async (row) => await processRow(row));
* for await (const result of stream) {
// Processed one-by-one, keeping memory usage flat.
}
```

***

### pluck()

> **pluck**\<`K`\>(`key`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:63](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/pluck.ts#L63)

Extract a specific property from each item in an asynchronous stream.
* Perfect for processing large streams of objects (e.g., from a database
cursor) where you only need one specific field, keeping memory usage
at a minimum.

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

The key to pluck from each async-yielded object.

#### Parameters

##### key

`K`

The property name to extract.

#### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\[`K`\]\>

A lazy async collection yielding plucked results sequentially.

***

### take()

> **take**(`limit`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/operators/take.ts:58](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/take.ts#L58)

Take a specified number of items from an asynchronous stream.
* **Backpressure Friendly:** The async generator stops pulling data
from the source (e.g., API, DB Cursor, or File Stream) as soon as
the limit is met, saving bandwidth and memory.

#### Parameters

##### limit

`number`

The maximum number of items to pull from the stream.

#### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

A lazy async collection that terminates after `limit` items.

***

### tap()

> **tap**(`fn`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/operators/tap.ts:63](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/tap.ts#L63)

Tap into an asynchronous stream to perform side effects.
* Provides a way to "spy" on the stream data. Each callback is awaited
sequentially as items flow through the async generator.

#### Parameters

##### fn

(`item`) => `void` \| `Promise`\<`void`\>

The async side-effect logic for the stream.

#### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

A lazy async collection that triggers effects as data flows.

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/operators/where.ts:88](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/where.ts#L88)

Filter the asynchronous stream by a given key / value pair.
* **Memory Efficient:** Compares items one-by-one as they flow from the source.

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### value

`T`\[`K`\]

##### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/operators/where.ts:89](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/where.ts#L89)

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### operator

[`ComparisonOperator`](../../../types/operator/type-aliases/ComparisonOperator.md)

###### value

`any`

##### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>
