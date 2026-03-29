[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: AsyncOperatorFn\<T, U\>

> **AsyncOperatorFn**\<`T`, `U`\> = (`ctx`, `fn`) => [`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`U`\>

Defined in: [core/types/operator.ts:81](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L81)

## Type Parameters

### T

`T`

### U

`U`

## Parameters

### ctx

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`T`\>

### fn

(`item`) => `U` \| `Promise`\<`U`\>

## Returns

[`AsyncCollection`](../../../engines/async/async-collection/classes/AsyncCollection.md)\<`U`\>
