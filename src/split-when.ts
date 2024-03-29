import { purry } from './purry';
import { splitAt } from './split-at';

/**
 * Splits a given array at the first index where the given predicate returns true.
 * @param array the array to split
 * @param fn the predicate
 * @signature
 *  splitWhen(array, fn)
 * @example
 *  import { splitWhen } from '@vicnunca/perkakas';
 *
 *  splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
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
 *  splitWhen(fn)(array)
 * @example
 *  import { splitWhen } from '@vicnunca/perkakas';
 *
 *  splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
export function splitWhen<T>(
  fn: (item: T) => boolean
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function splitWhen(...args: Array<any>): unknown {
  return purry(splitWhen_, args);
}

function splitWhen_<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => boolean,
): [Array<T>, Array<T>] {
  for (const [index, item] of array.entries()) {
    if (fn(item)) {
      return splitAt(array, index);
    }
  }

  return [array.slice(), []];
}
