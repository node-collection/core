[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: OperatorBlueprintProps\<TName, TArgs, TReturn\>

Defined in: [core/types/operator.ts:28](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L28)

A blueprint for an operator that can be applied to multiple subjects.

## Type Parameters

### TName

`TName` *extends* `string` = `string`

### TArgs

`TArgs` *extends* `unknown`[] = `unknown`[]

### TReturn

`TReturn` = `unknown`

## Properties

### category?

> `readonly` `optional` **category?**: `string`

Defined in: [core/types/operator.ts:30](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L30)

***

### definitions

> `readonly` **definitions**: readonly [`OperatorDefinitionProps`](OperatorDefinitionProps.md)\<[`Constructor`](../../common/type-aliases/Constructor.md)\<`object`\>, `TArgs`, `TReturn`\>[]

Defined in: [core/types/operator.ts:31](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L31)

***

### name

> `readonly` **name**: `TName`

Defined in: [core/types/operator.ts:29](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L29)
