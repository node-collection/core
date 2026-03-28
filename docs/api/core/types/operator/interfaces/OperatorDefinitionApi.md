[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: OperatorDefinitionApi()

Defined in: [core/types/operator.ts:51](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L51)

Define a new operator and attach it to the target collection prototypes.
* This method uses the Registry to prevent duplicate injections and
ensures type-safety across different collection engines.
*

## Example

```ts
defineOperator('map', Collection, (ctx, fn) => { ... });
```

## Call Signature

> **OperatorDefinitionApi**\<`TName`, `TArgs`, `TReturn`\>(`props`): `void`

Defined in: [core/types/operator.ts:52](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L52)

Define a new operator and attach it to the target collection prototypes.
* This method uses the Registry to prevent duplicate injections and
ensures type-safety across different collection engines.
*

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

### Example

```ts
defineOperator('map', Collection, (ctx, fn) => { ... });
```

## Call Signature

> **OperatorDefinitionApi**\<`TSubject`, `TArgs`, `TReturn`\>(`name`, `subject`, `fn`): `void`

Defined in: [core/types/operator.ts:54](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L54)

Define a new operator and attach it to the target collection prototypes.
* This method uses the Registry to prevent duplicate injections and
ensures type-safety across different collection engines.
*

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

### Example

```ts
defineOperator('map', Collection, (ctx, fn) => { ... });
```

## Call Signature

> **OperatorDefinitionApi**(`props`): `void`

Defined in: [core/types/operator.ts:60](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L60)

Define a new operator and attach it to the target collection prototypes.
* This method uses the Registry to prevent duplicate injections and
ensures type-safety across different collection engines.
*

### Parameters

#### props

[`OperatorCollectionProps`](OperatorCollectionProps.md)

### Returns

`void`

### Example

```ts
defineOperator('map', Collection, (ctx, fn) => { ... });
```

## Call Signature

> **OperatorDefinitionApi**(`name`, `definitions`): `void`

Defined in: [core/types/operator.ts:62](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L62)

Define a new operator and attach it to the target collection prototypes.
* This method uses the Registry to prevent duplicate injections and
ensures type-safety across different collection engines.
*

### Parameters

#### name

`string`

#### definitions

readonly [`OperatorDefinitionProps`](OperatorDefinitionProps.md)\<[`Constructor`](../../common/type-aliases/Constructor.md)\<`object`\>, `unknown`[], `unknown`\>[]

### Returns

`void`

### Example

```ts
defineOperator('map', Collection, (ctx, fn) => { ... });
```

## Call Signature

> **OperatorDefinitionApi**(`blueprint`): `void`

Defined in: [core/types/operator.ts:64](https://github.com/node-collection/core/blob/5862e745b196fa150803d8bd3e83ae8604324f73/src/core/types/operator.ts#L64)

Define a new operator and attach it to the target collection prototypes.
* This method uses the Registry to prevent duplicate injections and
ensures type-safety across different collection engines.
*

### Parameters

#### blueprint

[`OperatorBlueprintProps`](OperatorBlueprintProps.md)

### Returns

`void`

### Example

```ts
defineOperator('map', Collection, (ctx, fn) => { ... });
```
