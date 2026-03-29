[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: FnParams\<T\>

> **FnParams**\<`T`\> = `T` *extends* (...`args`) => `unknown` ? `P` : `never`

Defined in: [core/types/common.ts:30](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/common.ts#L30)

Extracts the parameter types of a function as a tuple.
* Commonly used to forward arguments from one function to another
while maintaining strict type safety.
*

## Type Parameters

### T

`T`

The function type to inspect.
