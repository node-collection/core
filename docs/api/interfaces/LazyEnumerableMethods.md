[**Node Collections API v1.0.0**](../README.md)

***

# Interface: LazyEnumerableMethods\<T\>

Defined in: core/contracts/enumerable.ts:9

Methods common to all lazy synchronous collections.

## Extended by

- [`LazyCollection`](../classes/LazyCollection.md)

## Type Parameters

### T

`T`

## Methods

### map()

> **map**\<`U`\>(`fn`): [`LazyCollection`](../classes/LazyCollection.md)\<`U`\>

Defined in: operators/map.ts:14

🟡 Sync Lazy — transform via generator, deferred hingga diiterasi

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U`

#### Returns

[`LazyCollection`](../classes/LazyCollection.md)\<`U`\>
