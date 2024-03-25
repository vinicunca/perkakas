import type { LazyEvaluator } from './pipe';

import { _reduceLazy } from './_reduce-lazy';
import { purry } from './purry';

type IsEquals<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param array the source array
 * @param other the values to exclude
 * @param isEquals the comparator
 * @signature
 *  differenceWith(array, other, isEquals)
 * @example
 *  import { differenceWith, isDeepEqual } from '@vinicunca/perkakas';
 *
 *  differenceWith(
 *    [{a: 1}, {a: 2}, {a: 3}, {a: 4}],
 *    [{a: 2}, {a: 5}, {a: 3}],
 *    isDeepEqual,
 *  ); // => [{a: 1}, {a: 4}]
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
 *
 * @param other the values to exclude
 * @param isEquals the comparator
 * @signature
 *  differenceWith(other, isEquals)(array)
 * @example
 *  import { differenceWith, isDeepEqual, pipe, take } from '@vinicunca/perkakas';
 *
 *  differenceWith(
 *    [{a: 2}, {a: 5}, {a: 3}],
 *    isDeepEqual,
 *  )([{a: 1}, {a: 2}, {a: 3}, {a: 4}]); // => [{a: 1}, {a: 4}]
 *  pipe(
 *    [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}, {a: 6}], // only 4 iterations
 *    differenceWith([{a: 2}, {a: 3}], isDeepEqual),
 *    take(2),
 *  ); // => [{a: 1}, {a: 4}]
 * @dataLast
 * @category Array
 * @pipeable
 */
export function differenceWith<TFirst, TSecond>(
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>
): (array: ReadonlyArray<TFirst>) => Array<TFirst>;

export function differenceWith(...args: Array<any>): unknown {
  return purry(differenceWith_, args, differenceWith.lazy);
}

function differenceWith_<TFirst, TSecond>(
  array: ReadonlyArray<TFirst>,
  other: ReadonlyArray<TSecond>,
  isEquals: IsEquals<TFirst, TSecond>,
): Array<TFirst> {
  const lazy = differenceWith.lazy(other, isEquals);
  return _reduceLazy(array, lazy);
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
