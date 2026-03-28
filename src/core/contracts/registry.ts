import { Constructor } from '../types/common';
import { OperatorFn } from '../types/operator';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * A normalised snapshot of a registered operator function.
 *
 * Stored inside the vTable to enable identity checks, structural equality
 * fallbacks, and conflict detection across plugin boundaries. All fields
 * are readonly — fingerprints are immutable once created.
 */
interface MethodFingerprint {
  /** The operator name as registered on the prototype. */
  readonly name: string;

  /**
   * Parameter count of the original `OperatorFn` (includes the leading `ctx` argument).
   * Used as a cheap pre-filter before the more expensive source comparison.
   */
  readonly length: number;

  /**
   * Single-space-normalised source string, computed once at registration time.
   *
   * Stored normalised (not raw) to avoid repeated `replace()` calls on
   * every `check()` invocation, and to guarantee both sides of the
   * structural comparison use identical normalisation logic.
   *
   * Uses `' '` as the replacement (not `''`) to prevent identifier
   * collision false-positives such as `"return value"` → `"returnvalue"`.
   */
  readonly source: string;

  /** Direct reference to the original function for O(1) identity checks. */
  readonly reference: OperatorFn<object, unknown[], unknown>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Produces a single-space-normalised representation of an operator function.
 *
 * Collapses all whitespace sequences (spaces, tabs, newlines) into a single
 * space, then trims leading and trailing whitespace. This strategy preserves
 * word boundaries — `"return value"` stays `"return value"` rather than
 * collapsing to `"returnvalue"` — while still ignoring irrelevant formatting
 * differences between logically identical functions.
 *
 * @param fn - The operator function to normalise.
 * @returns   The normalised source string.
 */
function normaliseSource(fn: OperatorFn<object, unknown[], unknown>): string {
  return fn.toString().replace(/\s+/g, ' ').trim();
}

// ─── vTable ───────────────────────────────────────────────────────────────────

/**
 * WeakMap-based Virtual Method Table.
 *
 * Keyed by `Constructor` so that entries are automatically garbage-collected
 * when the class itself is no longer reachable — no manual cleanup needed for
 * dynamically created or discarded engines.
 *
 * @internal
 */
const vTable = new WeakMap<Constructor<object>, Map<string, MethodFingerprint>>();

// ─── Registry ─────────────────────────────────────────────────────────────────

/**
 * Tracks all operators injected via `defineOperator` using a WeakMap-based
 * Virtual Method Table (vTable).
 *
 * The Registry provides three guarantees:
 * 1. **No silent overwrites** — `check()` detects when a different function
 *    is already registered under the same name on the same class, returning
 *    `'CONFLICT'` so `defineOperator` can emit a warning.
 * 2. **Idempotent registration** — re-registering the exact same function
 *    (same reference or structurally identical source) returns `'SAME'`
 *    and skips the injection entirely.
 * 3. **Hot-reload safety** — `unregister()` removes a single entry, allowing
 *    plugins to cleanly replace an operator without triggering a conflict.
 *
 * Resolution order inside `check()`:
 * - Reference identity (`fn === existing.reference`) — O(1), no allocation.
 * - Structural equality (same arity + normalised source) — catches
 *   re-imported or re-created function instances that are logically identical
 *   (common in CJS/ESM dual-package builds or HMR environments).
 * - `'CONFLICT'` — a genuinely different function is already registered.
 */
export const Registry = {
  /**
   * Checks whether an operator is already registered for the given class.
   *
   * @param subject - The collection engine constructor to check.
   * @param name    - The operator name (method key on the prototype).
   * @param fn      - The candidate operator function to compare against.
   *
   * @returns
   * - `'NONE'`     — no entry exists; safe to inject.
   * - `'SAME'`     — an identical function is already injected; skip silently.
   * - `'CONFLICT'` — a *different* function is already registered under this
   *                  name; the caller should warn before overwriting.
   *
   * @example
   * ```ts
   * const status = Registry.check(Collection, 'map', mapFn);
   *
   * if (status === 'NONE')     injectOperator(Collection, 'map', mapFn);
   * if (status === 'SAME')     return; // already registered, skip
   * if (status === 'CONFLICT') console.warn('Overwriting existing operator: map');
   * ```
   */
  check(subject: Constructor<object>, name: string, fn: OperatorFn<object, unknown[], unknown>): 'SAME' | 'CONFLICT' | 'NONE' {
    const methods = vTable.get(subject);
    if (!methods) return 'NONE';

    const existing = methods.get(name);
    if (!existing) return 'NONE';

    // Fast path — same function reference (most common case).
    if (existing.reference === fn) return 'SAME';

    // Structural fallback — handles identical logic registered from a different
    // module instance (e.g. dual CJS/ESM package, or HMR hot-swap).
    // Compare arity first (cheap) before comparing normalised source (expensive).
    if (existing.length === fn.length && existing.source === normaliseSource(fn)) {
      return 'SAME';
    }

    return 'CONFLICT';
  },

  /**
   * Records an operator fingerprint in the vTable.
   *
   * Always call `check` before `register` — this method performs no
   * duplicate detection and will silently overwrite any existing entry.
   * The source is normalised once at registration time and never recomputed.
   *
   * @param subject - The collection engine constructor to register on.
   * @param name    - The operator name (method key on the prototype).
   * @param fn      - The operator function to fingerprint and store.
   *
   * @example
   * ```ts
   * Registry.register(Collection, 'map', mapFn);
   * ```
   */
  register(subject: Constructor<object>, name: string, fn: OperatorFn<object, unknown[], unknown>): void {
    let methods = vTable.get(subject);

    if (!methods) {
      methods = new Map<string, MethodFingerprint>();
      vTable.set(subject, methods);
    }

    methods.set(name, {
      name,
      length: fn.length,
      source: normaliseSource(fn),
      reference: fn,
    });
  },

  /**
   * Removes a single operator fingerprint from the vTable.
   *
   * Intended for plugin hot-reloading — call `unregister` before
   * re-registering a new implementation to prevent a `'CONFLICT'` warning.
   * This does **not** remove the method from the class prototype itself;
   * that is the responsibility of the caller (typically `defineOperator`).
   *
   * @param subject - The collection engine constructor to unregister from.
   * @param name    - The operator name to remove.
   *
   * @returns `true` if an entry was found and removed, `false` if none existed.
   *
   * @example
   * ```ts
   * Registry.unregister(Collection, 'map');
   * Registry.register(Collection, 'map', newMapFn);
   * ```
   */
  unregister(subject: Constructor<object>, name: string): boolean {
    return vTable.get(subject)?.delete(name) ?? false;
  },

  /**
   * Returns `true` if an operator is registered under `name` for the given class.
   *
   * A lighter alternative to `check()` when you only need presence detection
   * and do not have a candidate function to compare against.
   *
   * @param subject - The collection engine constructor to query.
   * @param name    - The operator name to look up.
   *
   * @returns `true` if a fingerprint exists, `false` otherwise.
   *
   * @example
   * ```ts
   * if (Registry.has(Collection, 'map')) {
   *   console.log('map is already registered');
   * }
   * ```
   */
  has(subject: Constructor<object>, name: string): boolean {
    return vTable.get(subject)?.has(name) ?? false;
  },

  /**
   * Returns the names of all operators currently registered for a class.
   *
   * Useful for debugging, plugin inspection tooling, and test assertions
   * that verify a plugin installed its expected set of operators.
   *
   * @param subject - The collection engine constructor to inspect.
   * @returns A `string[]` of registered operator names, or an empty array
   *   if the class has no registered operators.
   *
   * @example
   * ```ts
   * Registry.list(Collection);
   * // ['map', 'filter', 'reduce', 'take', ...]
   * ```
   */
  list(subject: Constructor<object>): string[] {
    return Array.from(vTable.get(subject)?.keys() ?? []);
  },
};
