import { curry } from './curry';

/**
 * Takes the last `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to take.
 * @signature
 *    P.takeLast(array, n)
 * @example
 *    P.takeLast([1, 2, 3, 4, 5], 2) // => [4, 5]
 * @dataFirst
 * @category Array
 */
export function takeLast<T>(array: ReadonlyArray<T>, n: number): Array<T>;

/**
 * Take the last `n` elements from the `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    P.takeLast(n)(array)
 * @example
 *    P.takeLast(2)([1, 2, 3, 4, 5]) // => [4, 5]
 * @dataLast
 * @category Array
 */
export function takeLast<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;

export function takeLast(...args: ReadonlyArray<unknown>): unknown {
  return curry(takeLastImplementation, args);
}

function takeLastImplementation<T>(
  array: ReadonlyArray<T>,
  n: number,
): Array<T> {
  return (n >= 0 ? array.slice(array.length - n) : []);
}
