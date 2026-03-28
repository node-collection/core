[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: MethodOf\<T\>

> **MethodOf**\<`T`\> = `{ [K in keyof T]: T[K] extends (args: never[]) => unknown ? K : never }`\[keyof `T`\]

Defined in: [core/types/common.ts:9](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/common.ts#L9)

Extract method names from a given type.

## Type Parameters

### T

`T`
