import type { LazyEvaluator } from '../function/pipe';

import { purry } from '../function/purry';
import { reduceLazy } from '../utils/reduce-lazy';

type IsEquals<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 * @param array the source array
 * @param other the values to exclude
 * @param isEquals the comparator
 * @signature
 *    P.differenceWith(array, other, isEquals)
 * @example
 *    P.differenceWith(
 *      [{a: 1}, {a: 2}, {a: 3}, {a: 4}],
 *      [{a: 2}, {a: 5}, {a: 3}],
 *      P.equals,
 *    ) // => [{a: 1}, {a: 4}]
 * @dataFirst
 * @category Array
 * @pipeable
 */
export function differenceWith<TFirst, TSecond>(
  array: ReadonlyArray<TFirst>,
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>
): Array<TFirst>;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 * @param other the values to exclude
 * @param isEquals the comparator
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
 * @category Array
 * @pipeable
 */
export function differenceWith<TFirst, TSecond>(
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>
): (array: ReadonlyArray<TFirst>) => Array<TFirst>;

export function differenceWith(...args: any[]): unknown {
  return purry(differenceWith_, args, differenceWith.lazy);
}

function differenceWith_<TFirst, TSecond>(
  array: ReadonlyArray<TFirst>,
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): Array<TFirst> {
  const lazy = differenceWith.lazy(other, isEquals);
  return reduceLazy(array, lazy);
}

export namespace differenceWith {
  export function lazy<TFirst, TSecond>(
    other: ReadonlyArray<TSecond>,
    isEquals: IsEquals<TFirst, TSecond>,
  ): LazyEvaluator<TFirst> {
    return (value) =>
      other.every((otherValue) => !isEquals(value, otherValue))
        ? { done: false, hasNext: true, next: value }
        : { done: false, hasNext: false };
  }
}
