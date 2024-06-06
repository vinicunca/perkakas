import { curry } from './curry';

/**
 * Splits a given array at a given index.
 *
 * @param array - The array to split.
 * @param index - The index to split at.
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
  index: number,
): [Array<T>, Array<T>];

/**
 * Splits a given array at a given index.
 *
 * @param index - The index to split at.
 * @signature
 *    P.splitAt(index)(array)
 * @example
 *    P.splitAt(1)([1, 2, 3]) // => [[1], [2, 3]]
 *    P.splitAt(-1)([1, 2, 3, 4, 5]) // => [[1, 2, 3, 4], [5]]
 * @dataLast
 * @category Array
 */
export function splitAt<T>(
  index: number,
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function splitAt(...args: ReadonlyArray<unknown>): unknown {
  return curry(splitAtImplementation, args);
}

function splitAtImplementation<T>(
  array: ReadonlyArray<T>,
  index: number,
): [Array<T>, Array<T>] {
  const effectiveIndex = Math.max(
    Math.min(index < 0 ? array.length + index : index, array.length),
    0,
  );
  return [array.slice(0, effectiveIndex), array.slice(effectiveIndex)];
}
