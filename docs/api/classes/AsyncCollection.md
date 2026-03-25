[**Node Collections API v1.0.0**](../README.md)

***

# Class: AsyncCollection\<T\>

Defined in: core/engines/async/async-collection.ts:3

An eager, async collection backed by an array of Promises.
All Promises are resolved concurrently via `Promise.all`,
preserving input order regardless of resolution time.

Operator chains return a new `AsyncCollection` synchronously
to keep the API fluent — only [all](#all) triggers
actual Promise resolution.

## Example

```ts
const names = await new AsyncCollection([
  fetch('/api/users/1').then(r => r.json()),
  fetch('/api/users/2').then(r => r.json()),
])
  .map(u => u.name)
  .all(); // ['Alice', 'Bob']
```

## Extends

- [`AsyncEnumerable`](../interfaces/AsyncEnumerable.md)\<`T`\>.[`AsyncEnumerableMethods`](../interfaces/AsyncEnumerableMethods.md)\<`T`\>

## Type Parameters

### T

`T`

The resolved value type of each Promise.

## Constructors

### Constructor

> **new AsyncCollection**\<`T`\>(`items`): `AsyncCollection`\<`T`\>

Defined in: core/engines/async/async-collection.ts:37

Create a new AsyncCollection from an array of Promises
or a pre-resolved `Promise<T[]>` for efficient chaining.
Passing `Promise<T[]>` skips unnecessary `Promise.all`
wrapping inside operator chains like `map`.

#### Parameters

##### items

`Promise`\<`T`[]\> \| `Promise`\<`T`\>[]

An array of `Promise<T>` or a single `Promise<T[]>`.

#### Returns

`AsyncCollection`\<`T`\>

#### Inherited from

`AsyncEnumerable<T>.constructor`

## Properties

### items

> `protected` **items**: `Promise`\<`T`[]\> \| `Promise`\<`T`\>[]

Defined in: core/engines/async/async-collection.ts:37

An array of `Promise<T>` or a single `Promise<T[]>`.

## Methods

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncGenerator`\<`T`, `void`, `unknown`\>

Defined in: core/engines/async/async-collection.ts:51

Async-iterate over all resolved values in insertion order.
Resolves the full collection before yielding — use
[AsyncLazyCollection](AsyncLazyCollection.md) for true streaming behaviour.

#### Returns

`AsyncGenerator`\<`T`, `void`, `unknown`\>

#### Example

```ts
for await (const item of new AsyncCollection([Promise.resolve(1)])) {
  console.log(item);
}
```

#### Inherited from

`AsyncEnumerable.[asyncIterator]`

***

### all()

> **all**(): `Promise`\<`T`[]\>

Defined in: core/engines/async/async-collection.ts:70

Resolve and materialize all Promises into a plain array.
Runs all Promises concurrently — results are ordered
by input position, not by resolution time.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` resolving when all items are ready.

#### Example

```ts
await new AsyncCollection([
  Promise.resolve('a'),
  Promise.resolve('b'),
]).all(); // ['a', 'b']
```

#### Inherited from

[`AsyncEnumerable`](../interfaces/AsyncEnumerable.md).[`all`](../interfaces/AsyncEnumerable.md#all)

***

### map()

> **map**\<`U`\>(`fn`): `AsyncCollection`\<`U`\>

Defined in: operators/map.ts:18

🔵 Async Eager — transform list of Promises secara concurrent

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U` \| `Promise`\<`U`\>

#### Returns

`AsyncCollection`\<`U`\>

#### Inherited from

[`AsyncEnumerableMethods`](../interfaces/AsyncEnumerableMethods.md).[`map`](../interfaces/AsyncEnumerableMethods.md#map)
