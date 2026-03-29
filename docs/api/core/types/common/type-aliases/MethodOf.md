[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: MethodOf\<T\>

> **MethodOf**\<`T`\> = `{ [K in keyof T]: T[K] extends (args: never[]) => unknown ? K : never }`\[keyof `T`\]

Defined in: [core/types/common.ts:20](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/common.ts#L20)

Extracts only the keys of a type `T` that correspond to methods (functions).
* This is useful for building proxy objects or decorators that only
target class methods while ignoring properties.
*

## Type Parameters

### T

`T`

The source type to extract method names from.
*

## Example

```ts
class User { id: number; save() {} }
type UserMethods = MethodOf<User>; // "save"
```
