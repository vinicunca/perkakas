import type { PredIndexed, PredIndexedOptional } from './_types';

import { purry } from './purry';

function meanBy_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, number>) => {
    if (array.length === 0) {
      return Number.NaN;
    }

    let sum = 0;

    for (const [index, item] of array.entries()) {
      sum += indexed ? fn(item, index, array) : fn(item);
    }

    return sum / array.length;
  };
}

/**
 * Returns the mean of the elements of an array using the provided predicate.
 * @param fn predicate function
 * @signature
 *  meanBy(fn)(array)
 *  meanBy.indexed(fn)(array)
 * @example
 *  import { meanBy, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(
 *    [{a: 5}, {a: 1}, {a: 3}],
 *    meanBy(x => x.a)
 *  ); // 3
 * @dataLast
 * @indexed
 * @category Array
 */

export function meanBy<T>(
  fn: (item: T) => number
): (items: ReadonlyArray<T>) => number;

/**
 * Returns the mean of the elements of an array using the provided predicate.
 * @param items the array
 * @param fn predicate function
 * @signature
 *  meanBy(array, fn)
 *  meanBy.indexed(array, fn)
 * @example
 *  import { meanBy } from '@vinicunca/perkakas';
 *
 *  meanBy(
 *    [{a: 5}, {a: 1}, {a: 3}],
 *    x => x.a
 *  ); // 3
 * @dataFirst
 * @indexed
 * @category Array
 */

export function meanBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => number
): number;

export function meanBy(...args: Array<any>): unknown {
  return purry(meanBy_(false), args);
}

export namespace meanBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, number>
  ): number;

  export function indexed<T>(
    fn: PredIndexed<T, number>
  ): (array: ReadonlyArray<T>) => number;

  export function indexed(...args: Array<any>): unknown {
    return purry(meanBy_(true), args);
  }
}
