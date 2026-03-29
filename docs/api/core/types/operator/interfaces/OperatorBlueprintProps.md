[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: OperatorBlueprintProps\<TName, TArgs, TReturn\>

Defined in: [core/types/operator.ts:35](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L35)

A declarative blueprint for an operator, defining its name and its
multiple implementations across different engines.

## Type Parameters

### TName

`TName` *extends* `string` = `string`

### TArgs

`TArgs` *extends* `unknown`[] = `any`[]

### TReturn

`TReturn` = `any`

## Properties

### category?

> `readonly` `optional` **category?**: `string`

Defined in: [core/types/operator.ts:39](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L39)

Optional grouping for documentation or internal organization

***

### definitions

> `readonly` **definitions**: readonly [`OperatorDefinitionProps`](OperatorDefinitionProps.md)\<`any`, `TArgs`, `TReturn`\>[]

Defined in: [core/types/operator.ts:41](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L41)

Array of engine-specific implementations

***

### name

> `readonly` **name**: `TName`

Defined in: [core/types/operator.ts:37](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L37)

The method name to be injected into the prototype
