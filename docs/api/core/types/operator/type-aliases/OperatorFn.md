[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: OperatorFn\<TContext, TArgs, TReturn\>

> **OperatorFn**\<`TContext`, `TArgs`, `TReturn`\> = (`this`, `ctx`, ...`args`) => `TReturn`

Defined in: [core/types/operator.ts:18](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L18)

Represents the core logic of an operator function.
* This type defines how an operator interacts with its context and arguments.
*

## Type Parameters

### TContext

`TContext`

The engine instance (e.g., Collection, LazyCollection).

### TArgs

`TArgs` *extends* `unknown`[]

A tuple of arguments passed to the operator.

### TReturn

`TReturn`

The expected return value of the operator.

## Parameters

### this

`TContext`

### ctx

`TContext`

### args

...`TArgs`

## Returns

`TReturn`
