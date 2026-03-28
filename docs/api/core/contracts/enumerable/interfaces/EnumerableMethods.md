[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: EnumerableMethods\<T\>

Defined in: [core/contracts/enumerable.ts:70](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L70)

Extension surface for operators targeting the eager synchronous engine.

This interface is intentionally empty at the library level.
Plugin authors augment it via TypeScript module augmentation
to declare methods that `defineOperator` injects onto
`Collection`'s prototype at runtime.

## Example

```ts
// In your plugin — my-plugin/map.ts
declare module '@node-collections/core/contracts/enumerable' {
  interface EnumerableMethods<T> {
    /**
     * Transforms each element using the given mapping function.
     *
     * @param fn - A function that maps `T` to `U`.
     * @returns A new `Collection` of type `U`.
     */
    map<U>(fn: (item: T) => U): Collection<U>;
  }
}
```

## See

 - `defineOperator`
 - `Collection`

## Extended by

- [`Collection`](../../../engines/sync/collection/classes/Collection.md)

## Type Parameters

### T

`T`

The element type of the collection being extended.

## Methods

### filter()

> **filter**(`fn`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

Defined in: [core/operators/filter.ts:10](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/filter.ts#L10)

🟢 Sync Eager: Filter array secara langsung

#### Parameters

##### fn

(`item`) => `boolean`

#### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

***

### map()

> **map**\<`U`\>(`fn`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`U`\>

Defined in: [core/operators/map.ts:7](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/map.ts#L7)

🟢 Sync Eager — transform tiap item, hasilkan Collection baru

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U`

#### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`U`\>

***

### pluck()

> **pluck**\<`K`\>(`key`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:7](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/pluck.ts#L7)

🟢 Sync Eager: Ambil satu properti dari tiap object

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

#### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\[`K`\]\>

***

### take()

> **take**(`limit`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

Defined in: [core/operators/take.ts:7](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/take.ts#L7)

🟢 Sync Eager: Ambil N data pertama dari Array

#### Parameters

##### limit

`number`

#### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

***

### tap()

> **tap**(`fn`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

Defined in: [core/operators/tap.ts:7](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/tap.ts#L7)

🟢 Sync Eager: Intip data Array

#### Parameters

##### fn

(`item`) => `void`

#### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

Defined in: [core/operators/where.ts:34](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L34)

🟢 Sync Eager: Filter berdasarkan key & value

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### value

`T`\[`K`\]

##### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

Defined in: [core/operators/where.ts:35](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L35)

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

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>
