import type { IterableContainer } from './helpers/types';

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
export function takeLast<T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]>;
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
export function takeLast<T extends IterableContainer>(
  n: number,
): (array: T) => Array<T[number]>;

export function takeLast(...args: ReadonlyArray<unknown>): unknown {
  return curry(takeLastImplementation, args);
}

function takeLastImplementation<T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]> {
  return n > 0 ? array.slice(Math.max(0, array.length - n)) : [];
}
