[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: Unwrap\<T\>

> **Unwrap**\<`T`\> = `T` *extends* `Iterable`\<infer U\> ? `U` : `T` *extends* `AsyncIterable`\<infer V\> ? `V` : `T`

Defined in: [core/types/common.ts:26](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/common.ts#L26)

Unwrap an Iterable or AsyncIterable to get the underlying type.

## Type Parameters

### T

`T`
