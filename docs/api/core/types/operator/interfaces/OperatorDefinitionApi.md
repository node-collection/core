[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: OperatorDefinitionApi()

Defined in: [core/types/operator.ts:58](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L58)

The unified API for defining operators. Supports multiple overloads
for single or bulk registration.

## Call Signature

> **OperatorDefinitionApi**\<`TName`, `TArgs`, `TReturn`\>(`props`): `void`

Defined in: [core/types/operator.ts:60](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L60)

Define using a single blueprint object

### Type Parameters

#### TName

`TName` *extends* `string`

#### TArgs

`TArgs` *extends* `unknown`[]

#### TReturn

`TReturn`

### Parameters

#### props

[`OperatorBlueprintProps`](OperatorBlueprintProps.md)\<`TName`, `TArgs`, `TReturn`\>

### Returns

`void`

## Call Signature

> **OperatorDefinitionApi**\<`TSubject`, `TArgs`, `TReturn`\>(`name`, `subject`, `fn`): `void`

Defined in: [core/types/operator.ts:63](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L63)

Fast-track definition for a single implementation

### Type Parameters

#### TSubject

`TSubject` *extends* [`Constructor`](../../common/type-aliases/Constructor.md)\<`object`\>

#### TArgs

`TArgs` *extends* `unknown`[]

#### TReturn

`TReturn`

### Parameters

#### name

`string`

#### subject

`TSubject` \| `TSubject`[]

#### fn

[`OperatorFn`](../type-aliases/OperatorFn.md)\<`InstanceType`\<`TSubject`\>, `TArgs`, `TReturn`\>

### Returns

`void`

## Call Signature

> **OperatorDefinitionApi**(`props`): `void`

Defined in: [core/types/operator.ts:70](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L70)

Bulk registration via a collection object

### Parameters

#### props

[`OperatorCollectionProps`](OperatorCollectionProps.md)

### Returns

`void`

## Call Signature

> **OperatorDefinitionApi**(`name`, `definitions`): `void`

Defined in: [core/types/operator.ts:73](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L73)

Define using a name and an array of definitions

### Parameters

#### name

`string`

#### definitions

readonly [`OperatorDefinitionProps`](OperatorDefinitionProps.md)\<`any`, `any`, `any`\>[]

### Returns

`void`
