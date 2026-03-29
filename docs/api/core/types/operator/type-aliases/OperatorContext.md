[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: OperatorContext\<T\>

> **OperatorContext**\<`T`\> = `InstanceType`\<`T`\>

Defined in: [core/types/operator.ts:9](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/types/operator.ts#L9)

The execution context for an operator, typically an instance of a Collection engine.
* It resolves the class constructor to its instance type.
*

## Type Parameters

### T

`T` *extends* [`Constructor`](../../common/type-aliases/Constructor.md)\<`object`\>

The constructor of the collection engine.
