[**Node Collections API v1.0.0**](../README.md)

***

# Type Alias: Unwrap\<T\>

> **Unwrap**\<`T`\> = `T` *extends* `Iterable`\<infer U\> ? `U` : `T` *extends* `AsyncIterable`\<infer V\> ? `V` : `T`

Defined in: core/types/common.ts:26

Unwrap an Iterable or AsyncIterable to get the underlying type.

## Type Parameters

### T

`T`
