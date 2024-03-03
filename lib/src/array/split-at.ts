import { purry } from '../function/purry';

/**
 * Splits a given array at a given index.
 * @param array the array to split
 * @param index the index to split at
 * @signature
 *    P.splitAt(array, index)
 * @example
 *    P.splitAt([1, 2, 3], 1) // => [[1], [2, 3]]
 *    P.splitAt([1, 2, 3, 4, 5], -1) // => [[1, 2, 3, 4], [5]]
 * @dataFirst
 * @category Array
 */
export function splitAt<T>(
  array: ReadonlyArray<T>,
  index: number
): [Array<T>, Array<T>];

/**
 * Splits a given array at a given index.
 * @param index the index to split at
 * @signature
 *    P.splitAt(index)(array)
 * @example
 *    P.splitAt(1)([1, 2, 3]) // => [[1], [2, 3]]
 *    P.splitAt(-1)([1, 2, 3, 4, 5]) // => [[1, 2, 3, 4], [5]]
 * @dataLast
 * @category Array
 */
export function splitAt<T>(
  index: number
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function splitAt(...args: any[]) {
  return purry(_splitAt, args);
}

function _splitAt<T>(array: Array<T>, index: number) {
  const copy = [...array];
  const tail = copy.splice(index);
  return [copy, tail];
}
