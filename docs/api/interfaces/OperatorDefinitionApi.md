[**Node Collections API v1.0.0**](../README.md)

***

# Interface: OperatorDefinitionApi()

Defined in: core/types/operator.ts:51

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

Defined in: core/types/operator.ts:52

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

Defined in: core/types/operator.ts:54

Define a new operator and attach it to the target collection prototypes.
* This method uses the Registry to prevent duplicate injections and
ensures type-safety across different collection engines.
*

### Type Parameters

#### TSubject

`TSubject` *extends* [`Constructor`](../type-aliases/Constructor.md)\<`object`\>

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

Defined in: core/types/operator.ts:60

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

Defined in: core/types/operator.ts:62

Define a new operator and attach it to the target collection prototypes.
* This method uses the Registry to prevent duplicate injections and
ensures type-safety across different collection engines.
*

### Parameters

#### name

`string`

#### definitions

readonly [`OperatorDefinitionProps`](OperatorDefinitionProps.md)\<[`Constructor`](../type-aliases/Constructor.md)\<`object`\>, `unknown`[], `unknown`\>[]

### Returns

`void`

### Example

```ts
defineOperator('map', Collection, (ctx, fn) => { ... });
```

## Call Signature

> **OperatorDefinitionApi**(`blueprint`): `void`

Defined in: core/types/operator.ts:64

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
