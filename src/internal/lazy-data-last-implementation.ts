import type { DataFirst, UnaryFunction } from './data-last-implementation';
import type { ReducingMetadata } from './make-reducing';
import type {
  StoppableLazyEvaluator,
  StoppableMetadata,
} from './make-stoppable';
import type { IterableContainer } from './types/iterable-container';
import type { LazyEvaluator } from './types/lazy-evaluator';
import type { SimplifiedWritable } from './types/simplified-writable';
import {

  dataLastImplementation,

} from './data-last-implementation';

export type LazyUnaryFunction<
  T extends IterableContainer = ReadonlyArray<unknown>,
  P extends ReadonlyArray<unknown> = never,
  R = unknown,
> = UnaryFunction<T, R> & LazyDefinition<T, P>;

/**
 * `pipe` reads both marks off any lazy implementation, so neither is
 * required in general; a factory whose evaluators can stop must carry the
 * `makeStoppable` mark.
 */
export type LazyEvaluatorFactory<
  T extends IterableContainer,
  P extends ReadonlyArray<unknown>,
> = Partial<ReducingMetadata & StoppableMetadata>
  & (
      | ((...args: P) => LazyEvaluator<T[number], unknown>)
      | (((...args: P) => StoppableLazyEvaluator<T[number], unknown>)
        & StoppableMetadata)
    );

interface LazyDefinition<
  T extends IterableContainer,
  P extends ReadonlyArray<unknown>,
> {
  readonly lazy: LazyEvaluatorFactory<T, P>;
  readonly lazyArgs: P;
}

// Allows us to build the lazy definition dynamically at runtime.
type MutableLazyDefinition<
  T extends IterableContainer,
  P extends ReadonlyArray<unknown>,
> = Partial<SimplifiedWritable<LazyDefinition<T, P>>>;

/**
 * Use this helper function to build the data last implementation together with
 * a lazy implementation. Use this when you need to build your own currying
 * logic when you want to decide between dataFirst and dataLast on something
 * that isn't the number of arguments provided. This is useful for implementing
 * functions with optional or variadic parameters.
 */
export function lazyDataLastImplementation<
  T extends IterableContainer,
  P extends ReadonlyArray<unknown>,
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  args: P,
  lazy: LazyEvaluatorFactory<T, P>,
): LazyUnaryFunction<T, P, R> {
  const dataLast = dataLastImplementation(dataFirst, args);

  (dataLast as MutableLazyDefinition<T, P>).lazy = lazy;
  (dataLast as MutableLazyDefinition<T, P>).lazyArgs = args;

  // @ts-expect-error [ts2322] -- TypeScript doesn't narrow an object's declared type after its optional props are assigned, so it can't see that `dataLast` is now a complete `LazyUnaryFunction`.
  return dataLast;
}
