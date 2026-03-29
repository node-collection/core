[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: LazyEnumerableMethods\<T\>

Defined in: [core/contracts/enumerable.ts:101](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L101)

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

Defined in: [core/operators/filter.ts:43](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/filter.ts#L43)

Filter the collection lazily as it is being iterated.
* The predicate logic is deferred until a terminal method is called.
Each item is tested "just-in-time", making it ideal for large datasets
where you only need a few matching results.

#### Parameters

##### fn

(`item`) => `boolean`

The truth test logic.
- `item`: The current element provided by the generator.

#### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

A new lazy collection that yields filtered items.

#### Example

```ts
const firstLarge = collect(bigArray).lazy().filter(n => n > 1000).first();
// Only iterates until the first match is found.
```

***

### first()

> **first**(`fn?`): `T` \| `null`

Defined in: [core/operators/first.ts:36](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/first.ts#L36)

Get the first element lazily.
* **Short-circuiting:** This is highly efficient as it stops the
generator immediately once a match is found, avoiding unnecessary
processing of the remaining items.

#### Parameters

##### fn?

(`item`) => `boolean`

An optional truth test logic.

#### Returns

`T` \| `null`

The first matching element, or `null`.

***

### map()

> **map**\<`U`\>(`fn`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`U`\>

Defined in: [core/operators/map.ts:44](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/map.ts#L44)

Transform each element lazily as the collection is being iterated.
* Unlike eager map, this uses a generator pipeline. The transformation
is deferred until a terminal method (like `.toArray()`) is called.

#### Type Parameters

##### U

`U`

The type of the elements in the resulting lazy collection.

#### Parameters

##### fn

(`item`) => `U`

The transformation logic applied to each item.
- `item`: The current element provided by the generator.

#### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`U`\>

A new lazy collection that yields transformed items.

#### Example

```ts
const lazy = collect([1, 2, 3]).lazy().map(n => n * 10);
// No transformation happens yet.
console.log(lazy.first()); // 10 (Only the first item is processed)
```

***

### pluck()

> **pluck**\<`K`\>(`key`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:36](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/pluck.ts#L36)

Retrieve values for a given key lazily.
* The extraction is deferred until the collection is iterated. This
is highly efficient when you only need to pluck properties from
a subset of a massive dataset.

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

The key to pluck from each yielded object.

#### Parameters

##### key

`K`

The property name to extract.

#### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\[`K`\]\>

A new lazy collection yielding the plucked values.

***

### take()

> **take**(`limit`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

Defined in: [core/operators/take.ts:33](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/take.ts#L33)

Take a specified number of items lazily.
* **Short-circuiting:** This is highly efficient because the generator
stops iterating immediately once the limit is reached. It avoids
processing any subsequent items in the pipeline.

#### Parameters

##### limit

`number`

The maximum number of items to yield.

#### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

A new lazy collection that stops after `limit` items.

***

### tap()

> **tap**(`fn`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

Defined in: [core/operators/tap.ts:39](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/tap.ts#L39)

Tap into the collection lazily.
* **Deferred Side Effects:** The callback is NOT executed immediately.
It will only run for each item as it is being pulled through the
generator pipeline.

#### Parameters

##### fn

(`item`) => `void`

The side-effect logic to run during iteration.

#### Returns

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

A new lazy collection that triggers side effects upon iteration.
*

#### Example

```ts
const lazy = collect([1, 2]).lazy().tap(n => console.log(n));
// Nothing logged yet.
lazy.first(); // Logs: 1
```

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): [`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>

Defined in: [core/operators/where.ts:70](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/where.ts#L70)

Filter the collection lazily by a given key / value pair.
* **Short-circuiting:** Comparison happens only when items are pulled.

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

Defined in: [core/operators/where.ts:71](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/where.ts#L71)

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

[`LazyCollection`](../../../engines/sync/lazy-collection/classes/LazyCollection.md)\<`T`\>
