[**Node Collections API v1.0.0**](../README.md)

***

# Interface: EnumerableMethods\<T\>

Defined in: core/contracts/enumerable.ts:4

Methods common to all synchronous collections.

## Extended by

- [`Collection`](../classes/Collection.md)

## Type Parameters

### T

`T`

## Methods

### map()

> **map**\<`U`\>(`fn`): [`Collection`](../classes/Collection.md)\<`U`\>

Defined in: operators/map.ts:10

🟢 Sync Eager — transform tiap item, hasilkan Collection baru

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U`

#### Returns

[`Collection`](../classes/Collection.md)\<`U`\>
