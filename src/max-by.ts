import type { PredIndexed, PredIndexedOptional } from './_types';

import { purry } from '../purry';

function maxBy_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, number>) => {
    let ret: T | undefined;
    let retMax: number | undefined;

    for (const [index, item] of array.entries()) {
      const max = indexed ? fn(item, index, array) : fn(item);
      if (retMax === undefined || max > retMax) {
        ret = item;
        retMax = max;
      }
    }

    return ret;
  };
}

/**
 * Returns the max element using the provided predicate.
 * @param fn the predicate
 * @signature
 *    maxBy(fn)(array)
 *    maxBy.indexed(fn)(array)
 * @example
 *    pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      maxBy(x => x.a)
 *    ) // { a: 5 }
 * @dataLast
 * @indexed
 * @category Array
 */
export function maxBy<T>(
  fn: (item: T) => number
): (items: ReadonlyArray<T>) => T | undefined;

/**
 * Returns the max element using the provided predicate.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    maxBy(array, fn)
 *    maxBy.indexed(array, fn)
 * @example
 *    maxBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // { a: 5 }
 * @dataFirst
 * @indexed
 * @category Array
 */
export function maxBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => number
): T | undefined;

export function maxBy(...args: Array<any>): unknown {
  return purry(maxBy_(false), args);
}

export namespace maxBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, number>
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, number>
  ): (array: ReadonlyArray<T>) => T | undefined;
  export function indexed(...args: Array<any>): unknown {
    return purry(maxBy_(true), args);
  }
}
