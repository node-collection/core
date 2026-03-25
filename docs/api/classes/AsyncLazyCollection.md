[**Node Collections API v1.0.0**](../README.md)

***

# Class: AsyncLazyCollection\<T\>

Defined in: core/engines/async/async-lazy-collection.ts:3

A lazy, async collection backed by any `AsyncIterable<T>`.
Items are pulled on-demand — nothing runs until you
iterate with `for await...of` or call [all](#all).

The natural fit for async generators, Node.js streams,
paginated API cursors, or infinite async sequences.
Operator chains compose generators without triggering
resolution, keeping memory usage constant.

## Example

```ts
async function* paginate(cursor: string) {
  while (cursor) {
    const page = await fetchPage(cursor);
    yield* page.items;
    cursor = page.nextCursor;
  }
}

for await (const item of new AsyncLazyCollection(paginate('start'))) {
  process(item);
}
```

## Extends

- [`AsyncEnumerable`](../interfaces/AsyncEnumerable.md)\<`T`\>.[`AsyncLazyEnumerableMethods`](../interfaces/AsyncLazyEnumerableMethods.md)\<`T`\>

## Type Parameters

### T

`T`

The type of values yielded by the async iterable.

## Constructors

### Constructor

> **new AsyncLazyCollection**\<`T`\>(`source`): `AsyncLazyCollection`\<`T`\>

Defined in: core/engines/async/async-lazy-collection.ts:42

Create a new AsyncLazyCollection wrapping the given async iterable.
The source is not consumed on construction —
evaluation defers until the first `await iter.next()`.

#### Parameters

##### source

`AsyncIterable`\<`T`\>

Any `AsyncIterable<T>` to wrap.

#### Returns

`AsyncLazyCollection`\<`T`\>

#### Inherited from

`AsyncEnumerable<T>.constructor`

## Properties

### source

> `protected` **source**: `AsyncIterable`\<`T`\>

Defined in: core/engines/async/async-lazy-collection.ts:42

Any `AsyncIterable<T>` to wrap.

## Methods

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncGenerator`\<`T`, `void`, `unknown`\>

Defined in: core/engines/async/async-lazy-collection.ts:58

Async-iterate over elements from the source one at a time.
Each value is pulled lazily — only the currently
requested item occupies memory at any given moment.

#### Returns

`AsyncGenerator`\<`T`, `void`, `unknown`\>

#### Example

```ts
async function* gen() { yield 1; yield 2; yield 3; }

for await (const item of new AsyncLazyCollection(gen())) {
  console.log(item);
}
```

#### Inherited from

`AsyncEnumerable.[asyncIterator]`

***

### all()

> **all**(): `Promise`\<`T`[]\>

Defined in: core/engines/async/async-lazy-collection.ts:77

Eagerly drain the async iterable into a plain array.
Triggers full evaluation of the async generator chain —
avoid on infinite sequences or when streaming
is sufficient for your use case.

#### Returns

`Promise`\<`T`[]\>

A `Promise<T[]>` resolving after all items are yielded.

#### Example

```ts
async function* gen() { yield 100; yield 200; }

await new AsyncLazyCollection(gen()).all(); // [100, 200]
```

#### Inherited from

[`AsyncEnumerable`](../interfaces/AsyncEnumerable.md).[`all`](../interfaces/AsyncEnumerable.md#all)

***

### map()

> **map**\<`U`\>(`fn`): `AsyncLazyCollection`\<`U`\>

Defined in: operators/map.ts:22

🟣 Async Lazy — transform via async generator, deferred hingga diiterasi

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U` \| `Promise`\<`U`\>

#### Returns

`AsyncLazyCollection`\<`U`\>

#### Inherited from

[`AsyncLazyEnumerableMethods`](../interfaces/AsyncLazyEnumerableMethods.md).[`map`](../interfaces/AsyncLazyEnumerableMethods.md#map)
