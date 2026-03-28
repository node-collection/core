[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: OperatorDefinitionProps\<TSubject, TArgs, TReturn\>

Defined in: [core/types/operator.ts:16](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L16)

Properties required to define an operator for a specific class.

## Type Parameters

### TSubject

`TSubject` *extends* [`Constructor`](../../common/type-aliases/Constructor.md)\<`object`\> = [`Constructor`](../../common/type-aliases/Constructor.md)\<`object`\>

### TArgs

`TArgs` *extends* `unknown`[] = `unknown`[]

### TReturn

`TReturn` = `unknown`

## Properties

### fn

> `readonly` **fn**: [`OperatorFn`](../type-aliases/OperatorFn.md)\<`InstanceType`\<`TSubject`\>, `TArgs`, `TReturn`\>

Defined in: [core/types/operator.ts:22](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L22)

***

### subject

> `readonly` **subject**: `TSubject`

Defined in: [core/types/operator.ts:21](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L21)
