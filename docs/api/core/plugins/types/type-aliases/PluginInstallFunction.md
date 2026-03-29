[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: PluginInstallFunction\<TOptions\>

> **PluginInstallFunction**\<`TOptions`\> = (`app`, `options`) => `void` \| `Promise`\<`void`\>

Defined in: [core/plugins/types.ts:27](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/types.ts#L27)

The signature for a plugin's installation hook.
* Supports both synchronous and asynchronous setup logic.

## Type Parameters

### TOptions

`TOptions`

## Parameters

### app

[`PluginApp`](../interfaces/PluginApp.md)

### options

`TOptions`

## Returns

`void` \| `Promise`\<`void`\>
