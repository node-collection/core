[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: AsyncEnumerableMethods\<T\>

Defined in: [core/contracts/enumerable.ts:132](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L132)

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

Defined in: [core/operators/filter.ts:18](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/filter.ts#L18)

🔵 Async Eager: Filter list of Promises (Awaited)

#### Parameters

##### fn

(`item`) => `boolean` \| `Promise`\<`boolean`\>

#### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

***

### map()

> **map**\<`U`\>(`fn`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`U`\>

Defined in: [core/operators/map.ts:15](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/map.ts#L15)

🔵 Async Eager — transform list of Promises secara concurrent

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U` \| `Promise`\<`U`\>

#### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`U`\>

***

### pluck()

> **pluck**\<`K`\>(`key`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:15](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/pluck.ts#L15)

🔵 Async Eager: Pluck dari list of Promises

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

#### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\[`K`\]\>

***

### take()

> **take**(`limit`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

Defined in: [core/operators/take.ts:15](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/take.ts#L15)

🔵 Async Eager: Ambil N data pertama dari list of Promises

#### Parameters

##### limit

`number`

#### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

***

### tap()

> **tap**(`fn`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

Defined in: [core/operators/tap.ts:15](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/tap.ts#L15)

🔵 Async Eager: Intip data list of Promises

#### Parameters

##### fn

(`item`) => `void` \| `Promise`\<`void`\>

#### Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

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

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

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

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>
