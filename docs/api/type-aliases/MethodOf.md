[**Node Collections API v1.0.0**](../README.md)

***

# Type Alias: MethodOf\<T\>

> **MethodOf**\<`T`\> = `{ [K in keyof T]: T[K] extends (args: never[]) => unknown ? K : never }`\[keyof `T`\]

Defined in: core/types/common.ts:9

Extract method names from a given type.

## Type Parameters

### T

`T`
