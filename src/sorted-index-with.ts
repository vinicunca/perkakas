import { purry } from '../purry';
import { binarySearchCutoffIndex } from '../utils/binary-search-cutoff-index';

/**
 * Performs a **binary search** for the index of the item at which the predicate
 * stops returning `true`. This function assumes that the array is "sorted" in
 * regards to the predicate, meaning that running the predicate as a mapper on
 * it would result in an array `[...true[], ...false[]]`.
 * This stricter requirement from the predicate provides us 2 benefits over
 * `findIndex` which does a similar thing:
 * 1. It would run at O(logN) time instead of O(N) time.
 * 2. It always returns a value (it would return `data.length` if the
 * predicate returns `true` for all items).
 *
 * This function is the basis for all other sortedIndex functions which search
 * for a specific item in a sorted array, and it could be used to perform
 * similar efficient searches.
 *
 * @param data - Array, "sorted" by `predicate`
 * @param predicate - A predicate which also defines the array's order
 * @return - Index (In the range 0..data.length)
 *
 * @signature
 *    sortedIndexWith(data, predicate)
 * @example
 *    sortedIndexWith(['a','ab','abc'], (item) => item.length < 2) // => 1
 * @dataFirst
 * @indexed
 * @category Array
 *
 * @see findIndex, sortedIndex, sortedIndexBy, sortedLastIndex, sortedLastIndexBy
 */
export function sortedIndexWith<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T) => boolean,
): number;

/**
 * Performs a **binary search** for the index of the item at which the predicate
 * stops returning `true`. This function assumes that the array is "sorted" in
 * regards to the predicate, meaning that running the predicate as a mapper on
 * it would result in an array `[...true[], ...false[]]`.
 * This stricter requirement from the predicate provides us 2 benefits over
 * `findIndex` which does a similar thing:
 * 1. It would run at O(logN) time instead of O(N) time.
 * 2. It always returns a value (it would return `data.length` if the
 * predicate returns `false` for all items).
 *
 * This function is the basis for all other sortedIndex functions which search
 * for a specific item in a sorted array, and it could be used to perform
 * similar efficient searches.
 *
 * @param predicate - A predicate which also defines the array's order
 * @return - Index (In the range 0..data.length)
 *
 * @signature
 *    sortedIndexWith(predicate)(data)
 * @example
 *    pipe(['a','ab','abc'], sortedIndexWith((item) => item.length < 2)) // => 1
 * @dataLast
 * @indexed
 * @category Array
 *
 * @see findIndex, sortedIndex, sortedIndexBy, sortedLastIndex, sortedLastIndexBy
 */
export function sortedIndexWith<T>(
  predicate: (item: T) => boolean,
): (data: ReadonlyArray<T>) => number;

export function sortedIndexWith(...args: Array<any>): unknown {
  return purry(binarySearchCutoffIndex, args);
}

export namespace sortedIndexWith {
  export function indexed<T>(
    data: ReadonlyArray<T>,
    predicate: (item: T, index: number) => NonNullable<unknown>,
  ): number;
  export function indexed<T>(
    predicate: (item: T, index: number) => NonNullable<unknown>,
  ): (data: ReadonlyArray<T>) => number;
  export function indexed(...args: Array<any>): unknown {
    return purry(binarySearchCutoffIndex, args);
  }
}