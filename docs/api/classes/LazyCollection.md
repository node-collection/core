[**Node Collections API v1.0.0**](../README.md)

***

# Class: LazyCollection\<T\>

Defined in: core/engines/sync/lazy-collection.ts:3

A lazy, synchronous collection backed by any `Iterable<T>`.
Operator chains are deferred via generators — no work
is done until you iterate or call [all](#all).

## Example

```ts
function* range(n: number) {
  for (let i = 0; i < n; i++) yield i;
}

new LazyCollection(range(1_000_000))
  .map(x => x * 2)
  .all();
```

## Extends

- [`Enumerable`](../interfaces/Enumerable.md)\<`T`\>.[`LazyEnumerableMethods`](../interfaces/LazyEnumerableMethods.md)\<`T`\>

## Type Parameters

### T

`T`

The type of elements yielded by the source.

## Constructors

### Constructor

> **new LazyCollection**\<`T`\>(`source`): `LazyCollection`\<`T`\>

Defined in: core/engines/sync/lazy-collection.ts:33

Create a new LazyCollection wrapping the given iterable.
The source is not consumed on construction —
evaluation defers until iteration begins.

#### Parameters

##### source

`Iterable`\<`T`\>

Any `Iterable<T>` to wrap.

#### Returns

`LazyCollection`\<`T`\>

#### Inherited from

`Enumerable<T>.constructor`

## Properties

### source

> `protected` **source**: `Iterable`\<`T`\>

Defined in: core/engines/sync/lazy-collection.ts:33

Any `Iterable<T>` to wrap.

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Generator`\<`T`, `void`, `unknown`\>

Defined in: core/engines/sync/lazy-collection.ts:47

Iterate over all elements from the source iterable.
Each call creates a fresh pass — note that
generators can only be consumed once.

#### Returns

`Generator`\<`T`, `void`, `unknown`\>

#### Example

```ts
for (const item of new LazyCollection(new Set([1, 2, 3]))) {
  console.log(item);
}
```

#### Inherited from

`Enumerable.[iterator]`

***

### all()

> **all**(): `T`[]

Defined in: core/engines/sync/lazy-collection.ts:65

Eagerly materialize all deferred elements into an array.
Triggers full evaluation of the generator chain —
call only when the full result set is needed.

#### Returns

`T`[]

A new `T[]` containing all yielded elements.

#### Example

```ts
function* nums() { yield 1; yield 2; yield 3; }

new LazyCollection(nums()).all(); // [1, 2, 3]
```

#### Inherited from

[`Enumerable`](../interfaces/Enumerable.md).[`all`](../interfaces/Enumerable.md#all)

***

### map()

> **map**\<`U`\>(`fn`): `LazyCollection`\<`U`\>

Defined in: operators/map.ts:14

🟡 Sync Lazy — transform via generator, deferred hingga diiterasi

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U`

#### Returns

`LazyCollection`\<`U`\>

#### Inherited from

[`LazyEnumerableMethods`](../interfaces/LazyEnumerableMethods.md).[`map`](../interfaces/LazyEnumerableMethods.md#map)
