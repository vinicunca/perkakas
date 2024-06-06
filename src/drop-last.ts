import { curry } from './curry';

/**
 * Removes last `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    P.dropLast(array, n)
 * @example
 *    P.dropLast([1, 2, 3, 4, 5], 2) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
export function dropLast<T>(array: ReadonlyArray<T>, n: number): Array<T>;

/**
 * Removes last `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    P.dropLast(n)(array)
 * @example
 *    P.dropLast(2)([1, 2, 3, 4, 5]) // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
export function dropLast<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;

export function dropLast(...args: ReadonlyArray<unknown>): unknown {
  return curry(dropLastImplementation, args);
}

function dropLastImplementation<T>(
  array: ReadonlyArray<T>,
  n: number,
): Array<T> {
  return (n >= 0 ? array.slice(0, array.length - n) : [...array]);
}
