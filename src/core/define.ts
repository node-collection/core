import { Registry } from './contracts/registry';
import { Constructor } from './types/common';
import {
  OperatorBlueprintProps,
  OperatorCollectionProps,
  OperatorContext,
  OperatorDefinitionApi,
  OperatorDefinitionProps,
  OperatorFn,
} from './types/operator';

interface Resolved {
  name: string;
  definitions: readonly OperatorDefinitionProps[];
}
function resolveDefinitions(nameOrProps: unknown, subjectOrFn?: unknown, fnOrDefs?: unknown): Resolved {
  const isBlueprint = (v: any): v is OperatorBlueprintProps => typeof v === 'object' && v !== null && 'definitions' in v;
  const isShorthand = (n: any, f: any): f is Function => typeof n === 'string' && typeof f === 'function';
  const isInternalList = (n: any, s: any): s is any[] => typeof n === 'string' && Array.isArray(s);

  switch (true) {
    case isBlueprint(nameOrProps): {
      const { name, definitions } = nameOrProps as OperatorBlueprintProps;
      return { name, definitions };
    }
    case isShorthand(nameOrProps, fnOrDefs): {
      const name = nameOrProps as string;
      const subjects = Array.isArray(subjectOrFn) ? subjectOrFn : [subjectOrFn];
      const fn = fnOrDefs as OperatorFn<OperatorContext<Constructor<object>>, unknown[], unknown>;
      return {
        name,
        definitions: subjects.map((subject) => ({ subject: subject as Constructor<object>, fn })),
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
  if (typeof nameOrProps === 'object' && nameOrProps !== null && 'blueprints' in nameOrProps) {
    (nameOrProps as OperatorCollectionProps).blueprints.forEach((b) => defineOperator(b));
    return;
  }

  const { name, definitions } = resolveDefinitions(nameOrProps, subjectOrFn, fnOrDefs);

  if (!name || !definitions.length) return;

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
    Object.defineProperty(SubjectClass.prototype, name, {
      value: function (this: OperatorContext<typeof SubjectClass>, ...args: unknown[]) {
        return fn.apply(this, [this, ...args]);
      },
      enumerable: false,
      configurable: true,
      writable: true,
    });
    Registry.register(SubjectClass, name, fn);
  });
};
