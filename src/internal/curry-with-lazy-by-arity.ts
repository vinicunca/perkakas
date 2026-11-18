import type { DataFirst } from './data-last-implementation';
import type { LazyEvaluatorFactory, LazyEvaluatorFactoryOf, LazyUnaryFunction } from './lazy-data-last-implementation';
import type { IterableContainer } from './types/iterable-container';
import {
  lazyDataLastImplementation0,
  lazyDataLastImplementation1,
  lazyDataLastImplementation2,

} from './lazy-data-last-implementation';

/**
 * `curry1` for a data-first implementation that also has a lazy
 * implementation, which the data-last function carries for `pipe`.
 *
 * @param argumentsLength - The utility's `arguments.length`.
 * @example
 *    export function unique(data?: IterableContainer): unknown {
 *      return curryWithLazy1(
 *        uniqueImplementation,
 *        lazyImplementation,
 *        arguments.length,
 *        data,
 *      );
 *    }
 * @see curry1
 */
export function curryWithLazy1<
  T extends IterableContainer,
  // Always empty, but it keeps a generic implementation's data type inferred
  // from its constraint, as in `curry1`.
  P extends readonly [],
  R,
>(dataFirst: DataFirst<T, P, R>, lazy: LazyEvaluatorFactory<T, P>, argumentsLength: number, data: unknown): R | LazyUnaryFunction<T, P, R> {
  return argumentsLength >= 1
    ? dataFirst(
        // @ts-expect-error [ts2345] -- `arguments.length` picks the call style at runtime, which TypeScript can't narrow the parameters from; the overloads guarantee their types.
        data,
      )
    : lazyDataLastImplementation0(dataFirst, lazy);
}

/**
 * `curry2` for a data-first implementation that also has a lazy
 * implementation, which the data-last function carries for `pipe`.
 *
 * @param argumentsLength - The utility's `arguments.length`.
 * @example
 *    export function take(
 *      dataOrN: IterableContainer | number,
 *      n?: number,
 *    ): unknown {
 *      return curryWithLazy2(
 *        takeImplementation,
 *        lazyImplementation,
 *        arguments.length,
 *        dataOrN,
 *        n,
 *      );
 *    }
 * @see curry2
 * @see withLazyImplementation
 */
export function curryWithLazy2<
  T extends IterableContainer,
  P extends readonly [unknown],
  R,
>(dataFirst: DataFirst<T, P, R>,
  // A single argument reaches the lazy implementation as is, so its own
  // parameters are `P`; typing it by them lets TypeScript infer `P` from it
  // too, which `LazyEvaluatorFactory`'s deferred `LazyArgument` blocks.
  lazy: LazyEvaluatorFactoryOf<T, P>, argumentsLength: number, dataOrArgument: unknown, argument: unknown): R | LazyUnaryFunction<T, P, R> {
  return argumentsLength >= 2
    ? dataFirst(
        // @ts-expect-error [ts2345] -- `arguments.length` picks the call style at runtime, which TypeScript can't narrow the parameters from; the overloads guarantee their types.
        dataOrArgument,
        argument,
      )
    : lazyDataLastImplementation1(dataFirst, lazy, dataOrArgument);
}

/**
 * `curry3` for a data-first implementation that also has a lazy
 * implementation, which the data-last function carries for `pipe`.
 *
 * @param argumentsLength - The utility's `arguments.length`.
 * @example
 *    export function intersectionWith(
 *      dataOrOther: readonly unknown[],
 *      otherOrIsEqual?: readonly unknown[] | IsEqualFunction,
 *      isEqual?: IsEqualFunction,
 *    ): unknown {
 *      return curryWithLazy3(
 *        intersectionWithImplementation,
 *        lazyImplementation,
 *        arguments.length,
 *        dataOrOther,
 *        otherOrIsEqual,
 *        isEqual,
 *      );
 *    }
 * @see curry3
 * @see withLazyImplementation
 */
export function curryWithLazy3<
  T extends IterableContainer,
  P extends readonly [unknown, unknown],
  R,
>(dataFirst: DataFirst<T, P, R>, lazy: LazyEvaluatorFactory<T, P>, argumentsLength: number, dataOrFirst: unknown, firstOrSecond: unknown, second: unknown): R | LazyUnaryFunction<T, P, R> {
  return argumentsLength >= 3
    ? dataFirst(
        // @ts-expect-error [ts2345] -- `arguments.length` picks the call style at runtime, which TypeScript can't narrow the parameters from; the overloads guarantee their types.
        dataOrFirst,
        firstOrSecond,
        second,
      )
    : lazyDataLastImplementation2(dataFirst, lazy, dataOrFirst, firstOrSecond);
}
