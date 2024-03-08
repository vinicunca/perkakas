import type { PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';

function sumBy_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, number>) => {
    let sum = 0;

    for (const [index, item] of array.entries()) {
      const summand = indexed ? fn(item, index, array) : fn(item);
      sum += summand;
    }
    return sum;
  };
}

/**
 * Returns the sum of the elements of an array using the provided predicate.
 * @param fn predicate function
 * @signature
 *   P.sumBy(fn)(array)
 *   P.sumBy.indexed(fn)(array)
 * @example
 *    P.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      P.sumBy(x => x.a)
 *    ) // 9
 * @dataLast
 * @indexed
 * @category Array
 */

export function sumBy<T>(
  fn: (item: T) => number
): (items: ReadonlyArray<T>) => number;

/**
 * Returns the sum of the elements of an array using the provided predicate.
 * @param items the array
 * @param fn predicate function
 * @signature
 *   P.sumBy(array, fn)
 *   P.sumBy.indexed(array, fn)
 * @example
 *    P.sumBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 9
 * @dataFirst
 * @indexed
 * @category Array
 */

export function sumBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => number
): number;

export function sumBy(...args: any[]): unknown {
  return purry(sumBy_(false), args);
}

export namespace sumBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, number>
  ): number;

  export function indexed<T>(
    fn: PredIndexed<T, number>
  ): (array: ReadonlyArray<T>) => number;

  export function indexed(...args: any[]): unknown {
    return purry(sumBy_(true), args);
  }
}
