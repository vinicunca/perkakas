import type { LazyEvaluator } from '../function/pipe';

import { purry } from '../function/purry';
import { reduceLazy } from '../utils/reduce-lazy';

type Comparator<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 * @param array the source array
 * @param other the second array
 * @param comparator the custom comparator
 * @signature
 *    P.intersectionWith(array, other, comparator)
 * @example
 *    P.intersectionWith(
 *      [
 *        { id: 1, name: 'Ryan' },
 *        { id: 3, name: 'Emma' },
 *      ],
 *      [3, 5],
 *      (a, b) => a.id === b,
 *    ) // => [{ id: 3, name: 'Emma' }]
 * @dataFirst
 * @category Array
 * @pipeable
 */
export function intersectionWith<TFirst, TSecond>(
  array: ReadonlyArray<TFirst>,
  other: ReadonlyArray<TSecond>,
  comparator: Comparator<TFirst, TSecond>
): Array<TFirst>;

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 * @param other the second array
 * @param comparator the custom comparator
 * @signature
 *    P.intersectionWith(other, comparator)(array)
 * @example
 *    P.intersectionWith(
 *      [3, 5],
 *      (a, b) => a.id === b
 *      )([
 *        { id: 1, name: 'Ryan' },
 *        { id: 3, name: 'Emma' },
 *      ]); // => [{ id: 3, name: 'Emma' }]
 * @dataLast
 * @category Array
 * @pipeable
 */
export function intersectionWith<TFirst, TSecond>(
  other: ReadonlyArray<TSecond>,
  /**
   * type inference doesn't work properly for the comparator's first parameter
   * in data last variant
   */
  comparator: Comparator<TFirst, TSecond>
): (array: ReadonlyArray<TFirst>) => Array<TFirst>;

export function intersectionWith(...args: any[]): unknown {
  return purry(intersectionWith_, args, intersectionWith.lazy);
}

function intersectionWith_<TFirst, TSecond>(
  array: Array<TFirst>,
  other: Array<TSecond>,
  comparator: Comparator<TFirst, TSecond>,
) {
  const lazy = intersectionWith.lazy(other, comparator);
  return reduceLazy(array, lazy);
}

export namespace intersectionWith {
  export function lazy<TFirst, TSecond>(other: ReadonlyArray<TSecond>,
    comparator: Comparator<TFirst, TSecond>): LazyEvaluator<TFirst> {
    return (value) =>
      other.some((otherValue) => comparator(value, otherValue))
        ? { done: false, hasNext: true, next: value }
        : { done: false, hasNext: false };
  }
}
