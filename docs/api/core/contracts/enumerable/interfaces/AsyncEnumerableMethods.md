[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: AsyncEnumerableMethods\<T\>

Defined in: [core/contracts/enumerable.ts:132](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L132)

Extension surface for operators targeting the eager asynchronous engine.

Plugin authors augment this interface to declare methods injected
onto `AsyncCollection`'s prototype. Operators here typically
accept `fn: (item: T) => U | Promise<U>` to support both sync
and async transformations.

## Example

```ts
declare module '@node-collections/core/contracts/enumerable' {
  interface AsyncEnumerableMethods<T> {
    /**
     * Concurrently transforms all resolved items.
     *
     * @param fn - A sync or async mapping function.
     * @returns A new `AsyncCollection` of type `U`.
     */
    map<U>(fn: (item: T) => U | Promise<U>): AsyncCollection<U>;
  }
}
```

## See

 - `defineOperator`
 - `AsyncCollection`

## Extended by

- [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)

## Type Parameters

### T

`T`

The element type of the async collection being extended.

## Methods

### filter()

> **filter**(`fn`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

Defined in: [core/operators/filter.ts:65](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/filter.ts#L65)

Filter the collection asynchronously and concurrently.
* This method triggers all predicate checks simultaneously using `Promise.all`.
It is highly efficient for I/O bound filtering where the order of checks
doesn't matter, but execution speed does.

#### Parameters

##### fn

(`item`) => `boolean` \| `Promise`\<`boolean`\>

An async callback.
- `item`: The current element. Can return `boolean` or `Promise<boolean>`.

#### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

A promise-based collection resolving to the filtered results.

#### Example

```ts
const activeUsers = await collect(ids).async().filter(async (id) => {
return await api.checkStatus(id) === 'active';
});
// All status checks run in parallel.
```

***

### first()

> **first**(`fn?`): `Promise`\<`T` \| `null`\>

Defined in: [core/operators/first.ts:50](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/first.ts#L50)

Get the first element asynchronously.
* If a predicate is provided, it will await each truth test sequentially
to ensure the correct "first" occurrence is returned according to
the collection's order.

#### Parameters

##### fn?

(`item`) => `boolean` \| `Promise`\<`boolean`\>

An optional async truth test.
- `item`: The current element. Can return `boolean` or `Promise<boolean>`.

#### Returns

`Promise`\<`T` \| `null`\>

A promise resolving to the first matching element, or `null`.

***

### map()

> **map**\<`U`\>(`fn`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`U`\>

Defined in: [core/operators/map.ts:66](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/map.ts#L66)

Transform each element asynchronously and concurrently.
* Triggers all transformation promises simultaneously using `Promise.all`.
Best for high-throughput I/O where execution speed is critical.

#### Type Parameters

##### U

`U`

The type of the elements after the promise resolves.

#### Parameters

##### fn

(`item`) => `U` \| `Promise`\<`U`\>

An async callback.
- `item`: The current element. Can return `U` or `Promise<U>`.

#### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`U`\>

A promise-based collection resolving once all transformations finish.

#### Example

```ts
const users = await collect([1, 2, 3])
.async()
.map(async (id) => await fetchUser(id));
// All 3 fetches start at the same time (concurrently).
```

***

### pluck()

> **pluck**\<`K`\>(`key`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:49](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/pluck.ts#L49)

Retrieve values for a given key from an asynchronous collection.
* This method waits for the underlying data promise to resolve,
then extracts the specified property from every object in the list.

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

The key to pluck from the awaited objects.

#### Parameters

##### key

`K`

The property name to extract.

#### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\[`K`\]\>

An async collection resolving to a list of plucked values.

***

### take()

> **take**(`limit`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

Defined in: [core/operators/take.ts:45](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/take.ts#L45)

Take a specified number of items from an asynchronous collection.
* This method waits for the underlying data promise to resolve,
then eagerly slices the result to the requested limit.

#### Parameters

##### limit

`number`

The number of items to take from the resolved array.

#### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

An async collection resolving to the limited subset.

***

### tap()

> **tap**(`fn`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

Defined in: [core/operators/tap.ts:51](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/tap.ts#L51)

Tap into an asynchronous collection to perform side effects.
* Waits for the underlying data promise to resolve, then sequentially
executes the (potentially async) callback for every item.

#### Parameters

##### fn

(`item`) => `void` \| `Promise`\<`void`\>

An async side-effect callback. Can return `void` or `Promise<void>`.

#### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

An async collection resolving back to the original items.

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

Defined in: [core/operators/where.ts:79](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/where.ts#L79)

Filter the asynchronous collection by a given key / value pair.
* Waits for the data to resolve before applying the filter logic.

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### value

`T`\[`K`\]

##### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

Defined in: [core/operators/where.ts:80](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/where.ts#L80)

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

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>
