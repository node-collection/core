[**Node Collections API v1.0.0**](../../../../index.md)

***

# Function: use()

**`Internal`**

Implementation of the polymorphic use function.

## Call Signature

> **use**(`plugins`): `Promise`\<`void`[]\>

Defined in: [core/plugins/use.ts:17](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/use.ts#L17)

Bulk register multiple plugins.

### Parameters

#### plugins

[`NodeCollectionPlugin`](../../types/interfaces/NodeCollectionPlugin.md)\<`any`\>[]

An array of plugins to install concurrently.

### Returns

`Promise`\<`void`[]\>

A promise that resolves when all plugins are installed.

## Call Signature

> **use**\<`TOptions`\>(`plugin`): `Promise`\<`void`\>

Defined in: [core/plugins/use.ts:23](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/use.ts#L23)

Register a single plugin that doesn't require options.

### Type Parameters

#### TOptions

`TOptions` *extends* `void` \| `undefined`

### Parameters

#### plugin

[`NodeCollectionPlugin`](../../types/interfaces/NodeCollectionPlugin.md)\<`TOptions`\>

The plugin instance to install.

### Returns

`Promise`\<`void`\>

## Call Signature

> **use**\<`TOptions`\>(`plugin`, `options`): `Promise`\<`void`\>

Defined in: [core/plugins/use.ts:30](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/use.ts#L30)

Register a single plugin with mandatory or optional configuration.

### Type Parameters

#### TOptions

`TOptions`

### Parameters

#### plugin

[`NodeCollectionPlugin`](../../types/interfaces/NodeCollectionPlugin.md)\<`TOptions`\>

The plugin instance to install.

#### options

`TOptions`

The configuration object required by the plugin.

### Returns

`Promise`\<`void`\>
