[**Node Collections API v1.0.0**](../../../../index.md)

***

# Function: register()

> **register**\<`TSubject`, `TArgs`, `TReturn`\>(`subject`, `fn`): [`OperatorDefinitionProps`](../interfaces/OperatorDefinitionProps.md)

Defined in: [core/types/operator.ts:94](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L94)

Bridges a Subject (Class) with its Logic implementation.
* This function ensures strict type inference for the `ctx` parameter in the logic function
based on the provided `subject`.
*

## Type Parameters

### TSubject

`TSubject` *extends* [`Constructor`](../../common/type-aliases/Constructor.md)\<`object`\>

The engine class (e.g., Collection).

### TArgs

`TArgs` *extends* `unknown`[]

### TReturn

`TReturn`

## Parameters

### subject

`TSubject`

The engine constructor.

### fn

(`ctx`, ...`args`) => `TReturn`

The implementation logic.

## Returns

[`OperatorDefinitionProps`](../interfaces/OperatorDefinitionProps.md)

A validated operator definition property.
