[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: AsyncLazyEnumerableMethods\<T\>

Defined in: [core/contracts/enumerable.ts:163](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/contracts/enumerable.ts#L163)

Extension surface for operators targeting the lazy asynchronous engine.

Plugin authors augment this interface to declare methods injected
onto `AsyncLazyCollection`'s prototype. Operators here compose
async generators — no evaluation happens until iteration begins.

## Example

```ts
declare module '@node-collections/core/contracts/enumerable' {
  interface AsyncLazyEnumerableMethods<T> {
    /**
     * Lazily transforms each item as it is pulled from the source.
     * Evaluation is deferred until `for await...of` or `.all()`.
     *
     * @param fn - A sync or async mapping function.
     * @returns A new deferred `AsyncLazyCollection` of type `U`.
     */
    map<U>(fn: (item: T) => U | Promise<U>): AsyncLazyCollection<U>;
  }
}
```

## See

 - `defineOperator`
 - `AsyncLazyCollection`

## Extended by

- [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)

## Type Parameters

### T

`T`

The element type of the async lazy collection being extended.

## Methods

### filter()

> **filter**(`fn`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/operators/filter.ts:22](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/filter.ts#L22)

🟣 Async Lazy: Stream filter via Async Generator

#### Parameters

##### fn

(`item`) => `boolean` \| `Promise`\<`boolean`\>

#### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

***

### map()

> **map**\<`U`\>(`fn`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`U`\>

Defined in: [core/operators/map.ts:19](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/map.ts#L19)

🟣 Async Lazy — transform via async generator, deferred hingga diiterasi

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

(`item`) => `U` \| `Promise`\<`U`\>

#### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`U`\>

***

### pluck()

> **pluck**\<`K`\>(`key`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\[`K`\]\>

Defined in: [core/operators/pluck.ts:19](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/pluck.ts#L19)

🟣 Async Lazy: Pluck dari Stream

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

#### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\[`K`\]\>

***

### take()

> **take**(`limit`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/operators/take.ts:19](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/take.ts#L19)

🟣 Async Lazy: Berhenti tarik data dari stream setelah limit tercapai

#### Parameters

##### limit

`number`

#### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

***

### tap()

> **tap**(`fn`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/operators/tap.ts:19](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/tap.ts#L19)

🟣 Async Lazy: Intip data dari stream asinkron

#### Parameters

##### fn

(`item`) => `void` \| `Promise`\<`void`\>

#### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

***

### where()

#### Call Signature

> **where**\<`K`\>(`key`, `value`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/operators/where.ts:49](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L49)

🟣 Async Lazy: Filter stream

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### key

`K`

###### value

`T`\[`K`\]

##### Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

#### Call Signature

> **where**\<`K`\>(`key`, `operator`, `value`): [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

Defined in: [core/operators/where.ts:50](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/operators/where.ts#L50)

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

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>
