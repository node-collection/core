[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: LazyEnumerableMethods\<T\>

Defined in: [core/contracts/enumerable.ts:101](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L101)

Extension surface for operators targeting the lazy synchronous engine.

Plugin authors augment this interface to declare methods injected
onto `LazyCollection`'s prototype. Operators registered here
should return a new `LazyCollection` to preserve deferred evaluation.

## Example

```ts
declare module '@node-collections/core/contracts/enumerable' {
  interface LazyEnumerableMethods<T> {
    /**
     * Lazily transforms each element via a generator.
     * No transformation occurs until the collection is iterated.
     *
     * @param fn - A function that maps `T` to `U`.
     * @returns A new deferred `LazyCollection` of type `U`.
     */
    map<U>(fn: (item: T) => U): LazyCollection<U>;
  }
}
```

## See

 - `defineOperator`
 - `LazyCollection`

## Extended by

- [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)

## Type Parameters

### T

`T`

The element type of the lazy collection being extended.

## Methods

### filter()

> **filter**(`fn`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

Defined in: [core/operators/filter.ts:14](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/filter.ts#L14)

🟡 Sync Lazy: Predicate diperiksa saat iterasi berjalan

#### Parameters

##### fn

(`item`) => `boolean`

#### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

***

### map()

> **map**\<`U`\>(`fn`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`U`\>

Defined in: [core/operators/map.ts:11](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/map.ts#L11)

🟡 Sync Lazy — transform via generator, deferred hingga diiterasi

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U`

#### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`U`\>

***

### pluck()

> **pluck**\<`K`\>(`key`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:11](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/pluck.ts#L11)

🟡 Sync Lazy: Pluck via Generator

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

#### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\[`K`\]\>

***

### take()

> **take**(`limit`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

Defined in: [core/operators/take.ts:11](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/take.ts#L11)

🟡 Sync Lazy: Berhenti iterasi tepat setelah limit tercapai

#### Parameters

##### limit

`number`

#### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

***

### tap()

> **tap**(`fn`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

Defined in: [core/operators/tap.ts:11](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/tap.ts#L11)

🟡 Sync Lazy: Intip data saat iterasi berjalan

#### Parameters

##### fn

(`item`) => `void`

#### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

Defined in: [core/operators/where.ts:39](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L39)

🟡 Sync Lazy: Filter via generator

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### value

`T`\[`K`\]

##### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

Defined in: [core/operators/where.ts:40](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L40)

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

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>
