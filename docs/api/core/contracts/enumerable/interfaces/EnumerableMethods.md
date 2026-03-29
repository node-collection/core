[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: EnumerableMethods\<T\>

Defined in: [core/contracts/enumerable.ts:70](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/enumerable.ts#L70)

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

Defined in: [core/operators/filter.ts:23](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/filter.ts#L23)

Filter the collection using the given callback.
* This method iterates through the entire collection immediately (eagerly)
and returns a new [Collection](../../../engines/sync/collection/classes/Collection.md) containing only the elements that
pass the truth test.

#### Parameters

##### fn

(`item`) => `boolean`

The truth test callback.
- `item`: The current element being tested.

#### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

A new collection instance with the filtered elements.

#### Example

```ts
const evens = collect([1, 2, 3, 4]).filter(n => n % 2 === 0);
// Collection { items: [2, 4] }
```

***

### first()

> **first**(`fn?`): `T` \| `null`

Defined in: [core/operators/first.ts:23](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/first.ts#L23)

Get the first element in the collection, or the first element that
passes a given truth test.
* This method will return `null` if the collection is empty or if
no element passes the test.

#### Parameters

##### fn?

(`item`) => `boolean`

An optional truth test callback.
- `item`: The current element being tested.

#### Returns

`T` \| `null`

The first matching element, or `null` if none found.

#### Example

```ts
collect([1, 2, 3]).first(); // 1
collect([1, 2, 3]).first(n => n > 1); // 2
```

***

### map()

> **map**\<`U`\>(`fn`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`U`\>

Defined in: [core/operators/map.ts:23](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/map.ts#L23)

Transform each element in the collection using a callback function.
* This method iterates through the entire collection immediately (eagerly)
and returns a new [Collection](../../../engines/sync/collection/classes/Collection.md) containing the results.

#### Type Parameters

##### U

`U`

The type of the elements in the resulting collection.

#### Parameters

##### fn

(`item`) => `U`

The transformation callback.
- `item`: The current element being processed.

#### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`U`\>

A new collection instance with the transformed elements.

#### Example

```ts
const doubled = collect([1, 2, 3]).map(n => n * 2);
// Collection { items: [2, 4, 6] }
```

***

### pluck()

> **pluck**\<`K`\>(`key`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:22](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/pluck.ts#L22)

Retrieve all of the values for a given key from the collection.
* This method is ideal for extracting a single column or property from
a collection of objects into a flat collection of values.

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

A valid key (property name) of the objects in the collection.

#### Parameters

##### key

`K`

The name of the property to retrieve.

#### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\[`K`\]\>

A new collection containing only the values of the specified key.

#### Example

```ts
const users = collect([{ id: 1, name: 'Adi' }, { id: 2, name: 'Budi' }]);
const names = users.pluck('name'); // ['Adi', 'Budi']
```

***

### take()

> **take**(`limit`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

Defined in: [core/operators/take.ts:20](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/take.ts#L20)

Create a new collection with a specified number of items from the start.
* This method eagerly slices the underlying array and returns a new
[Collection](../../../engines/sync/collection/classes/Collection.md) containing only the first `limit` elements.

#### Parameters

##### limit

`number`

The number of items to take. If negative, 0 is used.

#### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

A new collection with the limited subset of items.

#### Example

```ts
collect([1, 2, 3, 4, 5]).take(3); // [1, 2, 3]
```

***

### tap()

> **tap**(`fn`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

Defined in: [core/operators/tap.ts:20](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/tap.ts#L20)

Tap into the collection to perform side effects without modifying the elements.
* This method eagerly iterates through the entire collection immediately,
executes the callback for each item, and returns the original collection.

#### Parameters

##### fn

(`item`) => `void`

The side-effect callback. Receives the current `item`.

#### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

The original collection instance.

#### Example

```ts
collect([1, 2, 3]).tap(n => console.log(n)); // Logs 1, 2, 3 immediately
```

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

Defined in: [core/operators/where.ts:50](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/where.ts#L50)

Filter the collection by a given key / value pair (Strict Equality).
*

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

The property name to filter by.

###### value

`T`\[`K`\]

The expected value to match.

##### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

A new collection containing only matching elements.
*

##### Example

```ts
collect(users).where('active', true);
```

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): [`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

Defined in: [core/operators/where.ts:62](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/operators/where.ts#L62)

Filter the collection using a custom comparison operator.
*

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

The property name to filter by.

###### operator

[`ComparisonOperator`](../../../types/operator/type-aliases/ComparisonOperator.md)

Valid comparison operator: '==', '===', '!=', '!==', '>', '<', '>=', '<=', 'contains'.

###### value

`any`

The value to compare against.

##### Returns

[`Collection`](../../../engines/sync/collection/classes/Collection.md)\<`T`\>

A new collection containing only matching elements.
*

##### Example

```ts
collect(products).where('price', '>', 100);
```
