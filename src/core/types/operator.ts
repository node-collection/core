import { AsyncCollection, AsyncLazyCollection, Collection, LazyCollection } from '../engines';
import { Constructor } from './common';

/**
 * The execution context for an operator, typically an instance of a Collection engine.
 * * It resolves the class constructor to its instance type.
 * * @template T - The constructor of the collection engine.
 */
export type OperatorContext<T extends Constructor<object>> = InstanceType<T>;

/**
 * Represents the core logic of an operator function.
 * * This type defines how an operator interacts with its context and arguments.
 * * @template TContext - The engine instance (e.g., Collection, LazyCollection).
 * @template TArgs - A tuple of arguments passed to the operator.
 * @template TReturn - The expected return value of the operator.
 */
export type OperatorFn<TContext, TArgs extends unknown[], TReturn> = (this: TContext, ctx: TContext, ...args: TArgs) => TReturn;

/**
 * Encapsulates the relationship between a Subject (Class) and its implementation Logic.
 * * Used by the Registry to map which logic to execute for which engine.
 */
export interface OperatorDefinitionProps<TSubject extends Constructor<object> = Constructor<object>, TArgs extends unknown[] = any[], TReturn = any> {
  /** The class constructor to target (e.g., Collection) */
  readonly subject: TSubject;
  /** The logic implementation for this specific subject */
  readonly fn: OperatorFn<OperatorContext<TSubject>, TArgs, TReturn>;
}

/**
 * A declarative blueprint for an operator, defining its name and its
 * multiple implementations across different engines.
 */
export interface OperatorBlueprintProps<TName extends string = string, TArgs extends unknown[] = any[], TReturn = any> {
  /** The method name to be injected into the prototype */
  readonly name: TName;
  /** Optional grouping for documentation or internal organization */
  readonly category?: string;
  /** Array of engine-specific implementations */
  readonly definitions: readonly OperatorDefinitionProps<any, TArgs, TReturn>[];
}

/**
 * A container for bulk operator registration.
 */
export interface OperatorCollectionProps {
  /** Optional prefix for the operator names */
  readonly namespace?: string;
  /** List of blueprints to register */
  readonly blueprints: readonly OperatorBlueprintProps<string, any, any>[];
}

/**
 * The unified API for defining operators. Supports multiple overloads
 * for single or bulk registration.
 */
export interface OperatorDefinitionApi {
  /** Define using a single blueprint object */
  <TName extends string, TArgs extends unknown[], TReturn>(props: OperatorBlueprintProps<TName, TArgs, TReturn>): void;

  /** Fast-track definition for a single implementation */
  <TSubject extends Constructor<object>, TArgs extends unknown[], TReturn>(
    name: string,
    subject: TSubject | TSubject[],
    fn: OperatorFn<OperatorContext<TSubject>, TArgs, TReturn>,
  ): void;

  /** Bulk registration via a collection object */
  (props: OperatorCollectionProps): void;

  /** Define using a name and an array of definitions */
  (name: string, definitions: readonly OperatorDefinitionProps<any, any, any>[]): void;
}

/** @category Internal Utility */
export type CollectionOperatorFn<T, U> = (ctx: Collection<T>, fn: (item: T) => U) => Collection<U>;
/** @category Internal Utility */
export type LazyOperatorFn<T, U> = (ctx: LazyCollection<T>, fn: (item: T) => U) => LazyCollection<U>;
/** @category Internal Utility */
export type AsyncOperatorFn<T, U> = (ctx: AsyncCollection<T>, fn: (item: T) => U | Promise<U>) => AsyncCollection<U>;
/** @category Internal Utility */
export type AsyncLazyOperatorFn<T, U> = (ctx: AsyncLazyCollection<T>, fn: (item: T) => U | Promise<U>) => AsyncLazyCollection<U>;

/**
 * Bridges a Subject (Class) with its Logic implementation.
 * * This function ensures strict type inference for the `ctx` parameter in the logic function
 * based on the provided `subject`.
 * * @template TSubject - The engine class (e.g., Collection).
 * @param subject - The engine constructor.
 * @param fn - The implementation logic.
 * @returns A validated operator definition property.
 */
export function register<TSubject extends Constructor<object>, TArgs extends unknown[], TReturn>(
  subject: TSubject,
  fn: (ctx: InstanceType<TSubject>, ...args: TArgs) => TReturn,
): OperatorDefinitionProps {
  return {
    subject: subject as any,
    fn: fn as any,
  };
}

/**
 * Comparison operators supported by the `where` engine.
 * Provides strict autocomplete and prevents invalid string usage.
 */
export type ComparisonOperator = '==' | '===' | '!=' | '!==' | '>' | '<' | '>=' | '<=' | 'contains';

/**
 * Constant array of valid operators for runtime validation.
 */
export const VALID_OPERATORS: ComparisonOperator[] = ['==', '===', '!=', '!==', '>', '<', '>=', '<=', 'contains'];
