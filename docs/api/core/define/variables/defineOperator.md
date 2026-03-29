[**Node Collections API v1.0.0**](../../../index.md)

***

# Variable: defineOperator

> `const` **defineOperator**: [`OperatorDefinitionApi`](../../types/operator/interfaces/OperatorDefinitionApi.md)

Defined in: [core/define.ts:71](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/define.ts#L71)

Defines and injects a new operator into the target collection prototypes.
* This is the central entry point for extending the library. It handles:
1. **Deduplication:** Prevents multiple injections of the same logic.
2. **Conflict Detection:** Warns if an operator name is already taken.
3. **Context Binding:** Automatically maps `this` to the first argument `ctx`.
4. **Encapsulation:** Injected methods are non-enumerable to prevent polluting object keys.
*

## Example

```ts
defineOperator('map', Collection, (ctx, fn) => { ... });
```
*

## Param

The operator name or a full blueprint.

## Param

The target class(es) or the definitions list.

## Param

The implementation logic (for shorthand syntax).
*
