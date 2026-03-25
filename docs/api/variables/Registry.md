[**Node Collections API v1.0.0**](../README.md)

***

# Variable: Registry

> `const` **Registry**: `object`

Defined in: core/contracts/registry.ts:19

The Registry keeps track of all injected operators using a WeakMap-based
Virtual Method Table (vTable). This ensures that we don't accidentally
overwrite existing logic and allows for safe plugin hot-reloading.

## Type Declaration

### check()

> **check**(`subject`, `name`, `fn`): `"SAME"` \| `"CONFLICT"` \| `"NONE"`

Check if an operator already exists on the subject and if it's identical.

#### Parameters

##### subject

[`Constructor`](../type-aliases/Constructor.md)\<`object`\>

##### name

`string`

##### fn

[`OperatorFn`](../type-aliases/OperatorFn.md)\<`object`, `unknown`[], `unknown`\>

#### Returns

`"SAME"` \| `"CONFLICT"` \| `"NONE"`

### register()

> **register**(`subject`, `name`, `fn`): `void`

Register a new operator fingerprint into the vTable.

#### Parameters

##### subject

[`Constructor`](../type-aliases/Constructor.md)\<`object`\>

##### name

`string`

##### fn

[`OperatorFn`](../type-aliases/OperatorFn.md)\<`object`, `unknown`[], `unknown`\>

#### Returns

`void`
