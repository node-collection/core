[**Node Collections API v1.0.0**](../README.md)

***

# Interface: OperatorBlueprintProps\<TName, TArgs, TReturn\>

Defined in: core/types/operator.ts:28

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

Defined in: core/types/operator.ts:30

***

### definitions

> `readonly` **definitions**: readonly [`OperatorDefinitionProps`](OperatorDefinitionProps.md)\<[`Constructor`](../type-aliases/Constructor.md)\<`object`\>, `TArgs`, `TReturn`\>[]

Defined in: core/types/operator.ts:31

***

### name

> `readonly` **name**: `TName`

Defined in: core/types/operator.ts:29
