[**Node Collections API v1.0.0**](../README.md)

***

# Interface: OperatorDefinitionProps\<TSubject, TArgs, TReturn\>

Defined in: core/types/operator.ts:16

Properties required to define an operator for a specific class.

## Type Parameters

### TSubject

`TSubject` *extends* [`Constructor`](../type-aliases/Constructor.md)\<`object`\> = [`Constructor`](../type-aliases/Constructor.md)\<`object`\>

### TArgs

`TArgs` *extends* `unknown`[] = `unknown`[]

### TReturn

`TReturn` = `unknown`

## Properties

### fn

> `readonly` **fn**: [`OperatorFn`](../type-aliases/OperatorFn.md)\<`InstanceType`\<`TSubject`\>, `TArgs`, `TReturn`\>

Defined in: core/types/operator.ts:22

***

### subject

> `readonly` **subject**: `TSubject`

Defined in: core/types/operator.ts:21
