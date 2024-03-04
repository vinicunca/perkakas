import { purry } from '../function/purry';
import { splitAt } from './split-at';

/**
 * Splits a given array at the first index where the given predicate returns true.
 * @param array the array to split
 * @param fn the predicate
 * @signature
 *    P.splitWhen(array, fn)
 * @example
 *    P.splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @dataFirst
 * @category Array
 */
export function splitWhen<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => boolean
): [Array<T>, Array<T>];

/**
 * Splits a given array at an index where the given predicate returns true.
 * @param fn the predicate
 * @signature
 *    P.splitWhen(fn)(array)
 * @example
 *    P.splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
export function splitWhen<T>(
  fn: (item: T) => boolean
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function splitWhen(...args: any[]) {
  return purry(_splitWhen, args);
}

function _splitWhen<T>(array: Array<T>, fn: (item: T) => boolean) {
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i]!)) {
      return splitAt(array, i);
    }
  }
  return [array, []];
}
