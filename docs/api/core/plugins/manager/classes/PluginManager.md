[**Node Collections API v1.0.0**](../../../../index.md)

***

# Class: PluginManager

Defined in: [core/plugins/manager.ts:5](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/plugins/manager.ts#L5)

## Constructors

### Constructor

> **new PluginManager**(): `PluginManager`

#### Returns

`PluginManager`

## Methods

### use()

> **use**\<`TOptions`\>(`plugin`, ...`args`): `Promise`\<`void`\>

Defined in: [core/plugins/manager.ts:7](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/plugins/manager.ts#L7)

#### Type Parameters

##### TOptions

`TOptions`

#### Parameters

##### plugin

[`NodeCollectionPlugin`](../../types/interfaces/NodeCollectionPlugin.md)\<`TOptions`\>

##### args

...[`PluginOptionsTuple`](../../types/type-aliases/PluginOptionsTuple.md)\<`TOptions`\>

#### Returns

`Promise`\<`void`\>
