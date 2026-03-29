[**Node Collections API v1.0.0**](../../../../index.md)

***

# Variable: Registry

> `const` **Registry**: `object`

Defined in: [core/contracts/registry.ts:93](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/contracts/registry.ts#L93)

Tracks all operators injected via `defineOperator` using a WeakMap-based
Virtual Method Table (vTable).

The Registry provides three guarantees:
1. **No silent overwrites** — `check()` detects when a different function
   is already registered under the same name on the same class, returning
   `'CONFLICT'` so `defineOperator` can emit a warning.
2. **Idempotent registration** — re-registering the exact same function
   (same reference or structurally identical source) returns `'SAME'`
   and skips the injection entirely.
3. **Hot-reload safety** — `unregister()` removes a single entry, allowing
   plugins to cleanly replace an operator without triggering a conflict.

Resolution order inside `check()`:
- Reference identity (`fn === existing.reference`) — O(1), no allocation.
- Structural equality (same arity + normalised source) — catches
  re-imported or re-created function instances that are logically identical
  (common in CJS/ESM dual-package builds or HMR environments).
- `'CONFLICT'` — a genuinely different function is already registered.

## Type Declaration

### check()

> **check**(`subject`, `name`, `fn`): `"SAME"` \| `"CONFLICT"` \| `"NONE"`

Checks whether an operator is already registered for the given class.

#### Parameters

##### subject

[`Constructor`](../../../types/common/type-aliases/Constructor.md)\<`object`\>

The collection engine constructor to check.

##### name

`string`

The operator name (method key on the prototype).

##### fn

[`OperatorFn`](../../../types/operator/type-aliases/OperatorFn.md)\<`object`, `unknown`[], `unknown`\>

The candidate operator function to compare against.

#### Returns

`"SAME"` \| `"CONFLICT"` \| `"NONE"`

- `'NONE'`     — no entry exists; safe to inject.
- `'SAME'`     — an identical function is already injected; skip silently.
- `'CONFLICT'` — a *different* function is already registered under this
                 name; the caller should warn before overwriting.

#### Example

```ts
const status = Registry.check(Collection, 'map', mapFn);

if (status === 'NONE')     injectOperator(Collection, 'map', mapFn);
if (status === 'SAME')     return; // already registered, skip
if (status === 'CONFLICT') console.warn('Overwriting existing operator: map');
```

### has()

> **has**(`subject`, `name`): `boolean`

Returns `true` if an operator is registered under `name` for the given class.

A lighter alternative to `check()` when you only need presence detection
and do not have a candidate function to compare against.

#### Parameters

##### subject

[`Constructor`](../../../types/common/type-aliases/Constructor.md)\<`object`\>

The collection engine constructor to query.

##### name

`string`

The operator name to look up.

#### Returns

`boolean`

`true` if a fingerprint exists, `false` otherwise.

#### Example

```ts
if (Registry.has(Collection, 'map')) {
  console.log('map is already registered');
}
```

### list()

> **list**(`subject`): `string`[]

Returns the names of all operators currently registered for a class.

Useful for debugging, plugin inspection tooling, and test assertions
that verify a plugin installed its expected set of operators.

#### Parameters

##### subject

[`Constructor`](../../../types/common/type-aliases/Constructor.md)\<`object`\>

The collection engine constructor to inspect.

#### Returns

`string`[]

A `string[]` of registered operator names, or an empty array
  if the class has no registered operators.

#### Example

```ts
Registry.list(Collection);
// ['map', 'filter', 'reduce', 'take', ...]
```

### register()

> **register**(`subject`, `name`, `fn`): `void`

Records an operator fingerprint in the vTable.

Always call `check` before `register` — this method performs no
duplicate detection and will silently overwrite any existing entry.
The source is normalised once at registration time and never recomputed.

#### Parameters

##### subject

[`Constructor`](../../../types/common/type-aliases/Constructor.md)\<`object`\>

The collection engine constructor to register on.

##### name

`string`

The operator name (method key on the prototype).

##### fn

[`OperatorFn`](../../../types/operator/type-aliases/OperatorFn.md)\<`object`, `unknown`[], `unknown`\>

The operator function to fingerprint and store.

#### Returns

`void`

#### Example

```ts
Registry.register(Collection, 'map', mapFn);
```

### unregister()

> **unregister**(`subject`, `name`): `boolean`

Removes a single operator fingerprint from the vTable.

Intended for plugin hot-reloading — call `unregister` before
re-registering a new implementation to prevent a `'CONFLICT'` warning.
This does **not** remove the method from the class prototype itself;
that is the responsibility of the caller (typically `defineOperator`).

#### Parameters

##### subject

[`Constructor`](../../../types/common/type-aliases/Constructor.md)\<`object`\>

The collection engine constructor to unregister from.

##### name

`string`

The operator name to remove.

#### Returns

`boolean`

`true` if an entry was found and removed, `false` if none existed.

#### Example

```ts
Registry.unregister(Collection, 'map');
Registry.register(Collection, 'map', newMapFn);
```
