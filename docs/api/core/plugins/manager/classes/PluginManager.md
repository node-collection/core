[**Node Collections API v1.0.0**](../../../../index.md)

***

# Class: PluginManager

Defined in: [core/plugins/manager.ts:11](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/manager.ts#L11)

Manages the lifecycle and registration of external plugins.
* This manager ensures that each plugin is only installed once and
provides a unified 'PluginApp' bridge to the library's core.
*

## Constructors

### Constructor

> **new PluginManager**(): `PluginManager`

#### Returns

`PluginManager`

## Methods

### has()

> **has**(`name`): `boolean`

Defined in: [core/plugins/manager.ts:73](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/manager.ts#L73)

Checks if a specific plugin has already been loaded.

#### Parameters

##### name

`string`

The unique name of the plugin.

#### Returns

`boolean`

***

### use()

> **use**\<`TOptions`\>(`plugin`, ...`args`): `Promise`\<`void`\>

Defined in: [core/plugins/manager.ts:31](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/manager.ts#L31)

Registers and initializes a new plugin.
* This method is asynchronous to support plugins that require
IO-bound setup (e.g., fetching configuration or connecting to remote logs)
before injecting their operators.
*

#### Type Parameters

##### TOptions

`TOptions`

The specific options type required by the plugin.

#### Parameters

##### plugin

[`NodeCollectionPlugin`](../../types/interfaces/NodeCollectionPlugin.md)\<`TOptions`\>

The plugin definition object.

##### args

...[`PluginOptionsTuple`](../../types/type-aliases/PluginOptionsTuple.md)\<`TOptions`\>

Arguments to be passed to the plugin's install method.

#### Returns

`Promise`\<`void`\>

A Promise that resolves once the plugin is fully operational.
*

#### Example

```ts
await pluginManager.use(MyAuthPlugin, { apiKey: '123' });
```
