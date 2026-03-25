[**Node Collections API v1.0.0**](../README.md)

***

# Class: Collection\<T\>

Defined in: core/engines/sync/collection.ts:3

An eager, synchronous collection backed by a plain array.
All operator chains are evaluated immediately into
a new array on each step.

## Example

```ts
const result = new Collection([1, 2, 3])
  .map(x => x * 2)
  .all(); // [2, 4, 6]
```

## Extends

- [`Enumerable`](../interfaces/Enumerable.md)\<`T`\>.[`EnumerableMethods`](../interfaces/EnumerableMethods.md)\<`T`\>

## Type Parameters

### T

`T`

The type of elements in this collection.

## Constructors

### Constructor

> **new Collection**\<`T`\>(`items`): `Collection`\<`T`\>

Defined in: core/engines/sync/collection.ts:29

Create a new Collection wrapping the given array.
The source is stored as-is — call [all](#all)
to retrieve a safe shallow copy.

#### Parameters

##### items

`T`[]

The source array to wrap.

#### Returns

`Collection`\<`T`\>

#### Inherited from

`Enumerable<T>.constructor`

## Properties

### items

> `protected` **items**: `T`[]

Defined in: core/engines/sync/collection.ts:29

The source array to wrap.

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Generator`\<`T`, `void`, `unknown`\>

Defined in: core/engines/sync/collection.ts:43

Iterate over all elements in insertion order.
Supports `for...of`, spread, and
destructuring natively.

#### Returns

`Generator`\<`T`, `void`, `unknown`\>

#### Example

```ts
for (const item of new Collection([1, 2, 3])) {
  console.log(item);
}
```

#### Inherited from

`Enumerable.[iterator]`

***

### all()

> **all**(): `T`[]

Defined in: core/engines/sync/collection.ts:59

Materialize all elements into a new array.
Returns a shallow copy — mutations to the result
do not affect this collection.

#### Returns

`T`[]

A new `T[]` containing all elements.

#### Example

```ts
new Collection([1, 2, 3]).all(); // [1, 2, 3]
```

#### Inherited from

[`Enumerable`](../interfaces/Enumerable.md).[`all`](../interfaces/Enumerable.md#all)

***

### map()

> **map**\<`U`\>(`fn`): `Collection`\<`U`\>

Defined in: operators/map.ts:10

🟢 Sync Eager — transform tiap item, hasilkan Collection baru

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U`

#### Returns

`Collection`\<`U`\>

#### Inherited from

[`EnumerableMethods`](../interfaces/EnumerableMethods.md).[`map`](../interfaces/EnumerableMethods.md#map)
