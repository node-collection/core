import { Registry } from './contracts';
import {
  Constructor,
  OperatorBlueprintProps,
  OperatorCollectionProps,
  OperatorContext,
  OperatorDefinitionApi,
  OperatorDefinitionProps,
} from './types';

/**
 * Internal interface for normalized operator data after resolution.
 * @internal
 */
interface ResolvedOperator {
  name: string;
  definitions: readonly OperatorDefinitionProps[];
}

/**
 * Resolves various input formats (shorthand, blueprint, or list) into a unified format.
 * * This helper handles the polymorphic nature of the `defineOperator` API.
 * * @param nameOrProps - The first argument of the API (string, blueprint, or collection).
 * @param subjectOrFn - The second argument (Constructor, Array of Constructors, or Definitions).
 * @param fnOrDefs - The third argument (The actual implementation function).
 * @returns A normalized {@link ResolvedOperator} object.
 * * @internal
 */
function resolveDefinitions(nameOrProps: unknown, subjectOrFn?: unknown, fnOrDefs?: unknown): ResolvedOperator {
  const isBlueprint = (v: unknown): v is OperatorBlueprintProps => typeof v === 'object' && v !== null && 'definitions' in v;

  const isShorthand = (n: unknown, f: unknown): f is (...args: any[]) => any => typeof n === 'string' && typeof f === 'function';

  const isInternalList = (n: unknown, s: unknown): s is readonly OperatorDefinitionProps[] => typeof n === 'string' && Array.isArray(s);

  if (isBlueprint(nameOrProps)) {
    return { name: nameOrProps.name, definitions: nameOrProps.definitions };
  }

  if (isShorthand(nameOrProps, fnOrDefs)) {
    const subjects = Array.isArray(subjectOrFn) ? subjectOrFn : [subjectOrFn as Constructor];
    return {
      name: nameOrProps as unknown as string,
      definitions: subjects.map((subject) => ({ subject, fn: fnOrDefs as any })),
    };
  }

  if (isInternalList(nameOrProps, subjectOrFn)) {
    return { name: nameOrProps as unknown as string, definitions: subjectOrFn };
  }

  return { name: '', definitions: [] };
}

/**
 * Defines and injects a new operator into the target collection prototypes.
 * * This is the central entry point for extending the library. It handles:
 * 1. **Deduplication:** Prevents multiple injections of the same logic.
 * 2. **Conflict Detection:** Warns if an operator name is already taken.
 * 3. **Context Binding:** Automatically maps `this` to the first argument `ctx`.
 * 4. **Encapsulation:** Injected methods are non-enumerable to prevent polluting object keys.
 * * @example
 * ```ts
 * defineOperator('map', Collection, (ctx, fn) => { ... });
 * ```
 * * @param nameOrProps - The operator name or a full blueprint.
 * @param subjectOrFn - The target class(es) or the definitions list.
 * @param fnOrDefs - The implementation logic (for shorthand syntax).
 * * @category Core
 */
export const defineOperator: OperatorDefinitionApi = (
  nameOrProps: string | OperatorBlueprintProps | OperatorCollectionProps,
  subjectOrFn?: Constructor | Constructor[] | unknown,
  fnOrDefs?: unknown,
): void => {
  // 1. Handle Bulk Registration (Collection of Blueprints)
  if (typeof nameOrProps === 'object' && nameOrProps !== null && 'blueprints' in nameOrProps) {
    (nameOrProps as OperatorCollectionProps).blueprints.forEach((blueprint) => defineOperator(blueprint));
    return;
  }

  // 2. Resolve Polymorphic Input into Normalized Definitions
  const { name, definitions } = resolveDefinitions(nameOrProps, subjectOrFn, fnOrDefs);

  if (!name || !definitions.length) return;

  // 3. Inject Logics to Prototypes
  definitions.forEach(({ subject: SubjectClass, fn }) => {
    if (!SubjectClass?.prototype) return;

    // Check against Registry to avoid redundant or conflicting injections
    const status = Registry.check(SubjectClass, name, fn);
    if (status === 'SAME') return;

    if (status === 'CONFLICT') {
      console.warn(
        `[NodeCollections] Warning: Operator '${name}' on class '${SubjectClass.name}' ` +
          `has been overwritten. Ensure this is intentional to avoid plugin conflicts!`,
      );
    }

    /**
     * Proxy function wrapper.
     * Maps the prototype call `this.op(...args)` to the logic `fn(ctx, ...args)`.
     * This allows us to maintain a clean functional logic while offering a fluent API.
     */
    const proxyValueFn = function (this: OperatorContext<typeof SubjectClass>, ...args: unknown[]) {
      return fn.apply(this, [this, ...args]);
    };

    // Injection using defineProperty to ensure the method is:
    // - Non-enumerable: Won't show up in Object.keys() or for...in loops.
    // - Configurable: Can be re-defined by other plugins if necessary.
    Object.defineProperty(SubjectClass.prototype, name, {
      value: proxyValueFn,
      enumerable: false,
      configurable: true,
      writable: true,
    });

    // Record the successful registration in the global Registry
    Registry.register(SubjectClass, name, fn);
  });
};
