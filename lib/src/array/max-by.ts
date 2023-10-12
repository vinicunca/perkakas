import type { PredIndexed, PredIndexedOptional } from '../utils/types';
import { purry } from '../function';

function _maxBy(indexed: boolean) {
  return <T>(array: Array<T>, fn: PredIndexedOptional<T, number>) => {
    let ret: T | undefined;
    let retMax: number | undefined;
    array.forEach((item, i) => {
      const max = indexed ? fn(item, i, array) : fn(item);
      if (retMax === undefined || max > retMax) {
        ret = item;
        retMax = max;
      }
    });

    return ret;
  };
}

/**
 * Returns the max element using the provided predicate.
 * @param fn the predicate
 * @signature
 *    P.maxBy(fn)(array)
 *    P.maxBy.indexed(fn)(array)
 * @example
 *    P.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      P.maxBy(x => x.a)
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
 *    P.maxBy(array, fn)
 *    P.maxBy.indexed(array, fn)
 * @example
 *    P.maxBy(
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

export function maxBy(...args: any[]) {
  return purry(_maxBy(false), args);
}

export namespace maxBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, number>
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, number>
  ): (array: ReadonlyArray<T>) => T | undefined;
  export function indexed(...args: any[]) {
    return purry(_maxBy(true), args);
  }
}
