[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: Unwrap\<T\>

> **Unwrap**\<`T`\> = `T` *extends* `Iterable`\<infer U\> ? `U` : `T` *extends* `AsyncIterable`\<infer V\> ? `V` : `T`

Defined in: [core/types/common.ts:51](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/common.ts#L51)

Unwraps the underlying value type from an `Iterable` or `AsyncIterable`.
* This is the "secret sauce" for the collection engines, allowing the
system to know that an `AsyncIterable<User>` contains `User` objects.
*

## Type Parameters

### T

`T`

The iterable or async iterable to unwrap.
*

## Example

```ts
type Item = Unwrap<string[]>; // string
type AsyncItem = Unwrap<AsyncIterable<number>>; // number
```
