import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curryFromLazy } from './internal/curry-from-lazy';
import { SKIP_ITEM } from './internal/utility-evaluators';

type IsEqual<T, Other> = (data: T, other: Other) => boolean;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param data - The source array.
 * @param other - The values to exclude.
 * @param isEqual - The comparator.
 * @signature
 *    differenceWith(data, other, isEqual)
 * @example
 *    differenceWith(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }],
 *      [2, 5, 3],
 *      ({ a }, b) => a === b,
 *    ); //=> [{ a: 1 }, { a: 4 }]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function differenceWith<T, Other>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<Other>,
  isEqual: IsEqual<T, Other>,
): Array<T>;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param other - The values to exclude.
 * @param isEqual - The comparator.
 * @signature
 *    differenceWith(other, isEqual)(data)
 * @example
 *    pipe(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }],
 *      differenceWith([2, 3], ({ a }, b) => a === b),
 *    ); //=> [{ a: 1 }, { a: 4 }, { a: 5 }, { a: 6 }]
 * @dataLast
 * @lazy
 * @category Array
 */
export function differenceWith<T, Other>(
  other: ReadonlyArray<Other>,
  isEqual: IsEqual<T, Other>,
): (data: ReadonlyArray<T>) => Array<T>;

export function differenceWith(...args: ReadonlyArray<unknown>): unknown {
  return curryFromLazy(lazyImplementation, args);
}

function lazyImplementation<T, Other>(other: ReadonlyArray<Other>, isEqual: IsEqual<T, Other>): LazyEvaluator<T> {
  return (value) =>
    other.every((otherValue) => !isEqual(value, otherValue))
      ? { done: false, hasNext: true, next: value }
      : SKIP_ITEM;
}
