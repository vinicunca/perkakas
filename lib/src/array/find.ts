import { type Pred, type PredIndexed, type PredIndexedOptional } from '../utils/types';
import { toLazyIndexed } from '../utils/to-lazy-indexed';
import { toSingle } from '../utils/to-single';
import { purry } from '../function';

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    P.find(items, fn)
 *    P.find.indexed(items, fn)
 * @example
 *    P.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 *    P.find.indexed([1, 3, 4, 6], (n, i) => n % 2 === 0) // => 4
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function find<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): T | undefined;

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param fn the predicate
 * @signature
 *    P.find(fn)(items)
 *    P.find.indexed(fn)(items)
 * @example
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.find(n => n % 2 === 0)
 *    ) // => 4
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.find.indexed((n, i) => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function find<T = never>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => T | undefined;

export function find() {
  return purry(_find(false), arguments, find.lazy);
}

function _find(indexed: boolean) {
  return <T>(array: Array<T>, fn: PredIndexedOptional<T, boolean>) => {
    if (indexed) {
      return array.find(fn);
    }

    return array.find((x) => fn(x));
  };
}

function _lazy(indexed: boolean) {
  return <T>(fn: PredIndexedOptional<T, boolean>) => {
    return (value: T, index?: number, array?: Array<T>) => {
      const valid = indexed ? fn(value, index, array) : fn(value);
      return {
        done: valid,
        hasNext: valid,
        next: value,
      };
    };
  };
}

export namespace find {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => T | undefined;
  export function indexed() {
    return purry(_find(true), arguments, find.lazyIndexed);
  }

  export const lazy = toSingle(_lazy(false));

  export const lazyIndexed = toSingle(toLazyIndexed(_lazy(true)));
}
