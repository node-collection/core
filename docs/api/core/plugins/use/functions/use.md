[**Node Collections API v1.0.0**](../../../../index.md)

***

# Function: use()

## Call Signature

> **use**(`plugins`): `Promise`\<`void`[]\>

Defined in: [core/plugins/use.ts:4](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/plugins/use.ts#L4)

### Parameters

#### plugins

[`NodeCollectionPlugin`](../../types/interfaces/NodeCollectionPlugin.md)\<`any`\>[]

### Returns

`Promise`\<`void`[]\>

## Call Signature

> **use**\<`TOptions`\>(`plugin`): `Promise`\<`void`\>

Defined in: [core/plugins/use.ts:5](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/plugins/use.ts#L5)

### Type Parameters

#### TOptions

`TOptions` *extends* `void` \| `undefined`

### Parameters

#### plugin

[`NodeCollectionPlugin`](../../types/interfaces/NodeCollectionPlugin.md)\<`TOptions`\>

### Returns

`Promise`\<`void`\>

## Call Signature

> **use**\<`TOptions`\>(`plugin`, `options`): `Promise`\<`void`\>

Defined in: [core/plugins/use.ts:6](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/plugins/use.ts#L6)

### Type Parameters

#### TOptions

`TOptions`

### Parameters

#### plugin

[`NodeCollectionPlugin`](../../types/interfaces/NodeCollectionPlugin.md)\<`TOptions`\>

#### options

`TOptions` *extends* `void` ? `never` : `TOptions`

### Returns

`Promise`\<`void`\>
