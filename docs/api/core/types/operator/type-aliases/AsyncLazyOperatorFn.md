[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: AsyncLazyOperatorFn\<T, U\>

> **AsyncLazyOperatorFn**\<`T`, `U`\> = (`ctx`, `fn`) => [`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`U`\>

Defined in: [core/types/operator.ts:83](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L83)

## Type Parameters

### T

`T`

### U

`U`

## Parameters

### ctx

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`T`\>

### fn

(`item`) => `U` \| `Promise`\<`U`\>

## Returns

[`AsyncLazyCollection`](../../../engines/async/async-lazy-collection/classes/AsyncLazyCollection.md)\<`U`\>
