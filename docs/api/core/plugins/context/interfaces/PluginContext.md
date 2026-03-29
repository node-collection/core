[**Node Collections API v1.0.0**](../../../../index.md)

***

# Interface: PluginContext

Defined in: [core/plugins/context.ts:5](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/context.ts#L5)

Global context shared across all registered plugins.
Useful for environment-specific logic (e.g., debugging).

## Properties

### env?

> `optional` **env?**: `string`

Defined in: [core/plugins/context.ts:7](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/context.ts#L7)

Current environment name (e.g., 'development', 'production', 'test')

***

### version?

> `optional` **version?**: `string`

Defined in: [core/plugins/context.ts:9](https://github.com/node-collection/core/blob/2fc8c36acc0b00976721e60bbd5bd5c41e41a6ab/src/core/plugins/context.ts#L9)

Optional version of the host library
