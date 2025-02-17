import type { LazyEvaluator } from './internal/types/lazy-evaluator';

import { curryFromLazy } from './internal/curry-from-lazy';
import { SKIP_ITEM } from './internal/utility-evaluators';

type IsEquals<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param array - The source array.
 * @param other - The values to exclude.
 * @param isEquals - The comparator.
 * @signature
 *    P.differenceWith(array, other, isEquals)
 * @example
 *    P.differenceWith(
 *      [{a: 1}, {a: 2}, {a: 3}, {a: 4}],
 *      [{a: 2}, {a: 5}, {a: 3}],
 *      P.equals,
 *    ) // => [{a: 1}, {a: 4}]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function differenceWith<TFirst, TSecond>(
  array: ReadonlyArray<TFirst>,
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): Array<TFirst>;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param other - The values to exclude.
 * @param isEquals - The comparator.
 * @signature
 *    P.differenceWith(other, isEquals)(array)
 * @example
 *    P.differenceWith(
 *      [{a: 2}, {a: 5}, {a: 3}],
 *      P.equals,
 *    )([{a: 1}, {a: 2}, {a: 3}, {a: 4}]) // => [{a: 1}, {a: 4}]
 *    P.pipe(
 *      [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}, {a: 6}], // only 4 iterations
 *      P.differenceWith([{a: 2}, {a: 3}], P.equals),
 *      P.take(2),
 *    ) // => [{a: 1}, {a: 4}]
 * @dataLast
 * @lazy
 * @category Array
 */
export function differenceWith<TFirst, TSecond>(
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): (array: ReadonlyArray<TFirst>) => Array<TFirst>;

export function differenceWith(...args: ReadonlyArray<unknown>): unknown {
  return curryFromLazy(lazyImplementation, args);
}

function lazyImplementation<TFirst, TSecond>(
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): LazyEvaluator<TFirst> {
  return (value) =>
    other.every((otherValue) => !isEquals(value, otherValue))
      ? { done: false, hasNext: true, next: value }
      : SKIP_ITEM;
}
