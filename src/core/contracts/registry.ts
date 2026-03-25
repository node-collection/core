import { Constructor } from '../types/common';
import { OperatorFn } from '../types/operator';

interface MethodFingerprint {
  readonly name: string;
  readonly length: number;
  readonly source: string;
  readonly reference: OperatorFn<object, unknown[], unknown>;
}

/** 🧠 Virtual Method Table (vTable) */
const vTable = new WeakMap<Constructor<object>, Map<string, MethodFingerprint>>();

/**
 * The Registry keeps track of all injected operators using a WeakMap-based
 * Virtual Method Table (vTable). This ensures that we don't accidentally
 * overwrite existing logic and allows for safe plugin hot-reloading.
 */
export const Registry = {
  /**
   * Check if an operator already exists on the subject and if it's identical.
   */
  check(subject: Constructor<object>, name: string, fn: OperatorFn<object, unknown[], unknown>): 'SAME' | 'CONFLICT' | 'NONE' {
    const methods = vTable.get(subject);
    if (!methods) return 'NONE';

    const existing = methods.get(name);
    if (!existing) return 'NONE';

    if (existing.reference === fn) return 'SAME';

    const currentSource = fn.toString().replace(/\s+/g, '');
    const existingSource = existing.source.replace(/\s+/g, '');

    if (existing.length === fn.length && existingSource === currentSource) {
      return 'SAME';
    }

    return 'CONFLICT';
  },

  /**
   * Register a new operator fingerprint into the vTable.
   */
  register(subject: Constructor<object>, name: string, fn: OperatorFn<object, unknown[], unknown>): void {
    if (!vTable.has(subject)) {
      vTable.set(subject, new Map());
    }

    vTable.get(subject)!.set(name, {
      name,
      length: fn.length,
      source: fn.toString(),
      reference: fn,
    });
  },
};
