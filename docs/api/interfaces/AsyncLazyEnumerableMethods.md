[**Node Collections API v1.0.0**](../README.md)

***

# Interface: AsyncLazyEnumerableMethods\<T\>

Defined in: core/contracts/enumerable.ts:19

Methods common to all lazy asynchronous collections.

## Extended by

- [`AsyncLazyCollection`](../classes/AsyncLazyCollection.md)

## Type Parameters

### T

`T`

## Methods

### map()

> **map**\<`U`\>(`fn`): [`AsyncLazyCollection`](../classes/AsyncLazyCollection.md)\<`U`\>

Defined in: operators/map.ts:22

🟣 Async Lazy — transform via async generator, deferred hingga diiterasi

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U` \| `Promise`\<`U`\>

#### Returns

[`AsyncLazyCollection`](../classes/AsyncLazyCollection.md)\<`U`\>
