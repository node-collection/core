[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: FnReturn\<T\>

> **FnReturn**\<`T`\> = `T` *extends* (...`args`) => infer R ? `R` : `never`

Defined in: [core/types/common.ts:38](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/common.ts#L38)

Extracts the return type of a function.
* Similar to TypeScript's built-in `ReturnType`, but often used in
custom mapped types within the operator registry.
*

## Type Parameters

### T

`T`

The function type to inspect.
