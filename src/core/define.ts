import { Registry } from './contracts';
import {
  Constructor,
  OperatorBlueprintProps,
  OperatorCollectionProps,
  OperatorContext,
  OperatorDefinitionApi,
  OperatorDefinitionProps,
} from './types';

interface Resolved {
  name: string;
  definitions: readonly OperatorDefinitionProps[];
}

/**
 * Helper to resolve operator definitions from various input formats.
 */
function resolveDefinitions(nameOrProps: unknown, subjectOrFn?: unknown, fnOrDefs?: unknown): Resolved {
  // Gunakan unknown dan type guard yang lebih ketat
  const isBlueprint = (v: unknown): v is OperatorBlueprintProps => typeof v === 'object' && v !== null && 'definitions' in v;

  // Ganti Function dengan signature yang lebih aman
  const isShorthand = (n: unknown, f: unknown): f is (...args: unknown[]) => unknown => typeof n === 'string' && typeof f === 'function';

  const isInternalList = (n: unknown, s: unknown): s is readonly OperatorDefinitionProps[] => typeof n === 'string' && Array.isArray(s);

  switch (true) {
    case isBlueprint(nameOrProps): {
      const { name, definitions } = nameOrProps as OperatorBlueprintProps;
      return { name, definitions };
    }
    case isShorthand(nameOrProps, fnOrDefs): {
      const name = nameOrProps as string;
      const subjects = Array.isArray(subjectOrFn) ? subjectOrFn : [subjectOrFn as Constructor];
      const fn = fnOrDefs as (...args: unknown[]) => unknown;
      return {
        name,
        definitions: subjects.map((subject) => ({ subject: subject as Constructor, fn })),
      };
    }
    case isInternalList(nameOrProps, subjectOrFn): {
      return {
        name: nameOrProps as string,
        definitions: subjectOrFn as readonly OperatorDefinitionProps[],
      };
    }
    default:
      return { name: '', definitions: [] };
  }
}

export const defineOperator: OperatorDefinitionApi = (
  nameOrProps: string | OperatorBlueprintProps | OperatorCollectionProps,
  subjectOrFn?: Constructor | Constructor[] | unknown,
  fnOrDefs?: unknown,
): void => {
  // 1. Handle Collection of Blueprints
  if (typeof nameOrProps === 'object' && nameOrProps !== null && 'blueprints' in nameOrProps) {
    (nameOrProps as OperatorCollectionProps).blueprints.forEach((b) => defineOperator(b));
    return;
  }

  // 2. Resolve Name & Definitions
  const { name, definitions } = resolveDefinitions(nameOrProps, subjectOrFn, fnOrDefs);

  if (!name || !definitions.length) return;

  // 3. Inject to Prototypes
  definitions.forEach(({ subject: SubjectClass, fn }) => {
    if (!SubjectClass?.prototype) return;

    const status = Registry.check(SubjectClass, name, fn);
    if (status === 'SAME') return;
    if (status === 'CONFLICT') {
      console.warn(
        `[NodeCollections] Warning: Operator '${name}' pada class '${SubjectClass.name}' ` +
          `ditimpa dengan logic baru. Pastikan ini tidak menyebabkan konflik antar plugin!`,
      );
    }

    // Proxy function untuk menjaga context 'this'
    const proxyValueFn = function (this: OperatorContext<typeof SubjectClass>, ...args: unknown[]) {
      return fn.apply(this, [this, ...args]);
    };

    // Injection menggunakan Object.defineProperty agar tidak enumerable
    Object.defineProperty(SubjectClass.prototype, name, {
      value: proxyValueFn,
      enumerable: false,
      configurable: true,
      writable: true,
    });

    Registry.register(SubjectClass, name, fn);
  });
};
