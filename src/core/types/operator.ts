import { Constructor } from './common';

/**
 * The execution context for an operator, typically an instance of a Collection.
 */
export type OperatorContext<T extends Constructor<object>> = InstanceType<T>;

/**
 * Represents an operator function logic.
 */
export type OperatorFn<TContext, TArgs extends unknown[], TReturn> = (this: TContext, ctx: TContext, ...args: TArgs) => TReturn;

/**
 * Properties required to define an operator for a specific class.
 */
export interface OperatorDefinitionProps<
  TSubject extends Constructor<object> = Constructor<object>,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> {
  readonly subject: TSubject;
  readonly fn: OperatorFn<OperatorContext<TSubject>, TArgs, TReturn>;
}

/**
 * A blueprint for an operator that can be applied to multiple subjects.
 */
export interface OperatorBlueprintProps<TName extends string = string, TArgs extends unknown[] = unknown[], TReturn = unknown> {
  readonly name: TName;
  readonly category?: string;
  readonly definitions: readonly OperatorDefinitionProps<Constructor<object>, TArgs, TReturn>[];
}

/**
 * A collection of blueprints for bulk registration.
 */
export interface OperatorCollectionProps {
  readonly namespace?: string;
  readonly blueprints: readonly OperatorBlueprintProps<string, unknown[], unknown>[];
}

/**
 * Define a new operator and attach it to the target collection prototypes.
 * * This method uses the Registry to prevent duplicate injections and
 * ensures type-safety across different collection engines.
 * * @example
 * ```ts
 * defineOperator('map', Collection, (ctx, fn) => { ... });
 * ```
 */
export interface OperatorDefinitionApi {
  <TName extends string, TArgs extends unknown[], TReturn>(props: OperatorBlueprintProps<TName, TArgs, TReturn>): void;

  <TSubject extends Constructor<object>, TArgs extends unknown[], TReturn>(
    name: string,
    subject: TSubject | TSubject[],
    fn: OperatorFn<OperatorContext<TSubject>, TArgs, TReturn>,
  ): void;

  (props: OperatorCollectionProps): void;

  (name: string, definitions: readonly OperatorDefinitionProps<Constructor<object>, unknown[], unknown>[]): void;

  (blueprint: OperatorBlueprintProps): void;
}
