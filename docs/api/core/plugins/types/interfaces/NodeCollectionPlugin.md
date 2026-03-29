[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: NodeCollectionPlugin\<TOptions\>

Defined in: [core/plugins/types.ts:44](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/types.ts#L44)

The standard contract for building NodeCollections plugins.
*

## Type Parameters

### TOptions

`TOptions` = `any`

The type of configuration object accepted by this plugin.
*

## Properties

### dependencies?

> `readonly` `optional` **dependencies?**: [`RegisteredOperators`](../type-aliases/RegisteredOperators.md)[]

Defined in: [core/plugins/types.ts:50](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/types.ts#L50)

List of operators this plugin expects to be present.
Useful for internal validation or documentation.

***

### install

> `readonly` **install**: [`PluginInstallFunction`](../type-aliases/PluginInstallFunction.md)\<`TOptions`\>

Defined in: [core/plugins/types.ts:54](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/types.ts#L54)

The entry point for the plugin logic.
This is where you call `app.defineOperator`.

***

### name

> `readonly` **name**: `string`

Defined in: [core/plugins/types.ts:46](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/types.ts#L46)

Unique identifier for the plugin (e.g., 'auth-filters')
