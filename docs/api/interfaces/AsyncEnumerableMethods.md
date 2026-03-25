[**Node Collections API v1.0.0**](../README.md)

***

# Interface: AsyncEnumerableMethods\<T\>

Defined in: core/contracts/enumerable.ts:14

Methods common to all eager asynchronous collections.

## Extended by

- [`AsyncCollection`](../classes/AsyncCollection.md)

## Type Parameters

### T

`T`

## Methods

### map()

> **map**\<`U`\>(`fn`): [`AsyncCollection`](../classes/AsyncCollection.md)\<`U`\>

Defined in: operators/map.ts:18

🔵 Async Eager — transform list of Promises secara concurrent

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U` \| `Promise`\<`U`\>

#### Returns

[`AsyncCollection`](../classes/AsyncCollection.md)\<`U`\>
