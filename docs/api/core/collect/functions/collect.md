[**Node Collections API v1.0.0**](../../../index.md)

***

# Function: collect()

**`Internal`**

Implementation of the collect factory.

## Call Signature

> **collect**\<`T`\>(`items`): [`AsyncCollection`](../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

Defined in: [core/collect.ts:28](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/collect.ts#L28)

Wrap an array of Promises or a Promise of an array into an eager async collection.
* * **Behavior:** Evaluates all promises concurrently via `Promise.all`.
* **Ideal for:** Batch API calls or DB queries where you need all results
before continuing the chain.

### Type Parameters

#### T

`T`

The type of elements in the collection.

### Parameters

#### items

`Promise`\<`T`[]\> \| `Promise`\<`T`\>[]

A Promise of an array or an array of Promises.

### Returns

[`AsyncCollection`](../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

A new [AsyncCollection](../../engines/async/async-collection/classes/AsyncCollection.md) instance.

### Example

```ts
const users = await collect([
fetch('/api/users/1').then(r => r.json()),
fetch('/api/users/2').then(r => r.json()),
]).map(u => u.name).all();
```

## Call Signature

> **collect**\<`T`\>(`items`): [`Collection`](../../engines/sync/collection/classes/Collection.md)\<`T`\>

Defined in: [core/collect.ts:44](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/collect.ts#L44)

Wrap a standard array into an eager synchronous collection.
* * **Behavior:** Materializes results into a new array at each operator step.
* **Ideal for:** Small to medium datasets where immediate execution and
simplicity are preferred over memory optimization.

### Type Parameters

#### T

`T`

The type of elements in the array.

### Parameters

#### items

`T`[]

A standard T[] array.

### Returns

[`Collection`](../../engines/sync/collection/classes/Collection.md)\<`T`\>

A new [Collection](../../engines/sync/collection/classes/Collection.md) instance.
*

### Example

```ts
const result = collect([1, 2, 3]).map(x => x * 2).all(); // [2, 4, 6]
```

## Call Signature

> **collect**\<`T`\>(`items`): [`AsyncLazyCollection`](../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/collect.ts:64](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/collect.ts#L64)

Wrap an async iterable into a lazy asynchronous collection.
* * **Behavior:** Items are pulled on-demand. Transformations are deferred
via async generators.
* **Ideal for:** Processing massive streams (e.g., Large CSVs, DB Cursors)
without loading everything into RAM.

### Type Parameters

#### T

`T`

The type of elements yielded by the async iterable.

### Parameters

#### items

`AsyncIterable`\<`T`\>

Any `AsyncIterable<T>` (e.g., async generator, readable stream).

### Returns

[`AsyncLazyCollection`](../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

A new [AsyncLazyCollection](../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md) instance.
*

### Example

```ts
async function* paginate() {
yield await fetchPage(1);
}
* const stream = collect(paginate()).map(p => p.data);
```

## Call Signature

> **collect**\<`T`\>(`items`): [`LazyCollection`](../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

Defined in: [core/collect.ts:77](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/collect.ts#L77)

Wrap any synchronous iterable into a lazy synchronous collection.
* * **Behavior:** Uses generator-based pipelines. Transformations only
occur when you iterate or call terminal methods (like `.all()`).
* **Ideal for:** Large datasets or complex pipelines where intermediate
array allocations should be avoided.

### Type Parameters

#### T

`T`

The type of elements yielded by the iterable.

### Parameters

#### items

`Iterable`\<`T`\>

Any `Iterable<T>` (e.g., Set, Map, custom Generator).

### Returns

[`LazyCollection`](../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

A new [LazyCollection](../../engines/sync/lazy-collection/classes/LazyCollection.md) instance.
