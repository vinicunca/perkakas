import type { PredIndexed, PredIndexedOptional } from './_types';

import { purry } from '../purry';

function minBy_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, number>) => {
    let ret: T | undefined;
    let retMin: number | undefined;

    for (const [index, item] of array.entries()) {
      const min = indexed ? fn(item, index, array) : fn(item);
      if (retMin === undefined || min < retMin) {
        ret = item;
        retMin = min;
      }
    }

    return ret;
  };
}

/**
 * Returns the min element using the provided predicate.
 * @param fn the predicate
 * @signature
 *    minBy(fn)(array)
 *    minBy.indexed(fn)(array)
 * @example
 *    pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      minBy(x => x.a)
 *    ) // { a: 1 }
 * @dataLast
 * @indexed
 * @category Array
 */
export function minBy<T>(
  fn: (item: T) => number
): (items: ReadonlyArray<T>) => T | undefined;

/**
 * Returns the min element using the provided predicate.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    minBy(array, fn)
 *    minBy.indexed(array, fn)
 * @example
 *    minBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // { a: 1 }
 * @dataFirst
 * @indexed
 * @category Array
 */
export function minBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => number
): T | undefined;

export function minBy(...args: Array<any>): unknown {
  return purry(minBy_(false), args);
}

export namespace minBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, number>,
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, number>,
  ): (array: ReadonlyArray<T>) => T | undefined;
  export function indexed(...args: Array<any>): unknown {
    return purry(minBy_(true), args);
  }
}