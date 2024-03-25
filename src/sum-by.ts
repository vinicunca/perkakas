import type { PredIndexed, PredIndexedOptional } from './_types';

import { purry } from './purry';

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
 *
 * @param fn predicate function
 * @signature
 *  sumBy(fn)(array)
 *  sumBy.indexed(fn)(array)
 * @example
 *  import { sumBy, pipe } from '@vicnunca/perkakas';
 *
 *  pipe(
 *    [{a: 5}, {a: 1}, {a: 3}],
 *    sumBy(x => x.a)
 *  ) // 9
 * @dataLast
 * @indexed
 * @category Array
 */

export function sumBy<T>(
  fn: (item: T) => number
): (items: ReadonlyArray<T>) => number;

/**
 * Returns the sum of the elements of an array using the provided predicate.
 *
 * @param items the array
 * @param fn predicate function
 * @signature
 *  sumBy(array, fn)
 *  sumBy.indexed(array, fn)
 * @example
 *  import { sumBy } from '@vicnunca/perkakas';
 *
 *  sumBy(
 *    [{a: 5}, {a: 1}, {a: 3}],
 *    x => x.a
 *  ) // 9
 * @dataFirst
 * @indexed
 * @category Array
 */

export function sumBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => number
): number;

export function sumBy(...args: Array<any>): unknown {
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

  export function indexed(...args: Array<any>): unknown {
    return purry(sumBy_(true), args);
  }
}
