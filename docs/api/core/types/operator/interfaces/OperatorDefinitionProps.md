[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: OperatorDefinitionProps\<TSubject, TArgs, TReturn\>

Defined in: [core/types/operator.ts:24](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L24)

Encapsulates the relationship between a Subject (Class) and its implementation Logic.
* Used by the Registry to map which logic to execute for which engine.

## Type Parameters

### TSubject

`TSubject` *extends* [`Constructor`](../../common/type-aliases/Constructor.md)\<`object`\> = [`Constructor`](../../common/type-aliases/Constructor.md)\<`object`\>

### TArgs

`TArgs` *extends* `unknown`[] = `any`[]

### TReturn

`TReturn` = `any`

## Properties

### fn

> `readonly` **fn**: [`OperatorFn`](../type-aliases/OperatorFn.md)\<`InstanceType`\<`TSubject`\>, `TArgs`, `TReturn`\>

Defined in: [core/types/operator.ts:28](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L28)

The logic implementation for this specific subject

***

### subject

> `readonly` **subject**: `TSubject`

Defined in: [core/types/operator.ts:26](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L26)

The class constructor to target (e.g., Collection)
