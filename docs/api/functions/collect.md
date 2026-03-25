[**Node Collections API v1.0.0**](../README.md)

***

# Function: collect()

**`Internal`**

## Call Signature

> **collect**\<`T`\>(`items`): [`AsyncCollection`](../classes/AsyncCollection.md)\<`T`\>

Defined in: index.ts:28

Wrap an array of Promises into an eager async collection.
Evaluates all promises concurrently via Promise.all,
resolving the entire set before any operator runs.

### Type Parameters

#### T

`T`

### Parameters

#### items

`Promise`\<`T`\>[]

An array of `Promise<T>` to wrap.

### Returns

[`AsyncCollection`](../classes/AsyncCollection.md)\<`T`\>

An [AsyncCollection](../classes/AsyncCollection.md) instance.

### Example

```ts
const users = await collect([
  fetch('/api/users/1').then(r => r.json()),
  fetch('/api/users/2').then(r => r.json()),
]).map(u => u.name).all();
```

## Call Signature

> **collect**\<`T`\>(`items`): [`Collection`](../classes/Collection.md)\<`T`\>

Defined in: index.ts:47

Wrap a standard array into an eager sync collection.
All operator chains are evaluated immediately,
materializing results into a new array each step.

### Type Parameters

#### T

`T`

### Parameters

#### items

`T`[]

A standard `T[]` array to wrap.

### Returns

[`Collection`](../classes/Collection.md)\<`T`\>

A [Collection](../classes/Collection.md) instance.

### Example

```ts
const result = collect([1, 2, 3])
  .map(x => x * 2)
  .all(); // [2, 4, 6]
```

## Call Signature

> **collect**\<`T`\>(`items`): [`AsyncLazyCollection`](../classes/AsyncLazyCollection.md)\<`T`\>

Defined in: index.ts:69

Wrap an async iterable into a lazy async collection.
Items are pulled on-demand — nothing runs until
you iterate with `for await...of` or call `.all()`.

### Type Parameters

#### T

`T`

### Parameters

#### items

`AsyncIterable`\<`T`\>

Any `AsyncIterable<T>` (e.g. async generator, stream).

### Returns

[`AsyncLazyCollection`](../classes/AsyncLazyCollection.md)\<`T`\>

An [AsyncLazyCollection](../classes/AsyncLazyCollection.md) instance.

### Example

```ts
async function* paginate() {
  for (let page = 1; page <= 10; page++)
    yield await fetchPage(page);
}

for await (const data of collect(paginate()).map(p => p.items)) { ... }
```

## Call Signature

> **collect**\<`T`\>(`items`): [`LazyCollection`](../classes/LazyCollection.md)\<`T`\>

Defined in: index.ts:90

Wrap any sync iterable into a lazy sync collection.
Transformations are deferred via generators, avoiding
intermediate array allocation on every operator step.

### Type Parameters

#### T

`T`

### Parameters

#### items

`Iterable`\<`T`\>

Any `Iterable<T>` (e.g. `Set`, `Map`, generator).

### Returns

[`LazyCollection`](../classes/LazyCollection.md)\<`T`\>

A [LazyCollection](../classes/LazyCollection.md) instance.

### Example

```ts
function* range(n: number) {
  for (let i = 0; i < n; i++) yield i;
}

const result = collect(range(1_000_000)).map(x => x * 2).all();
```
