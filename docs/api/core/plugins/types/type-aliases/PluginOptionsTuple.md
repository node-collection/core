[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: PluginOptionsTuple\<TOptions\>

> **PluginOptionsTuple**\<`TOptions`\> = `TOptions` *extends* `void` \| `undefined` ? \[\] : \[`TOptions`\]

Defined in: [core/plugins/types.ts:21](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/types.ts#L21)

Helper to handle polymorphic plugin options.
* If `TOptions` is void or undefined, it results in an empty tuple `[]`.
Otherwise, it requires a single `options` argument of type `TOptions`.

## Type Parameters

### TOptions

`TOptions`
