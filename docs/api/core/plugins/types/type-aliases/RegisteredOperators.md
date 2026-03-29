[**Node Collections API v1.0.0**](../../../../index.md)

***

# Type Alias: RegisteredOperators

> **RegisteredOperators** = keyof [`EnumerableMethods`](../../../contracts/enumerable/interfaces/EnumerableMethods.md)\<`unknown`\> \| keyof [`LazyEnumerableMethods`](../../../contracts/enumerable/interfaces/LazyEnumerableMethods.md)\<`unknown`\> \| keyof [`AsyncEnumerableMethods`](../../../contracts/enumerable/interfaces/AsyncEnumerableMethods.md)\<`unknown`\> \| keyof [`AsyncLazyEnumerableMethods`](../../../contracts/enumerable/interfaces/AsyncLazyEnumerableMethods.md)\<`unknown`\>

Defined in: [core/plugins/types.ts:10](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/types.ts#L10)

A union of all available operator names across all four collection dimensions.
* This allows plugins to declare their requirements and ensures that
dependencies refer to actual existing methods.
