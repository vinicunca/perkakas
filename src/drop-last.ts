import type { IterableContainer } from './internal/types/iterable-container';

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
export function dropLast<T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]>;

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
export function dropLast(
  n: number,
): <T extends IterableContainer>(array: T) => Array<T[number]>;

export function dropLast(...args: ReadonlyArray<unknown>): unknown {
  return curry(dropLastImplementation, args);
}

function dropLastImplementation<T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]> {
  return n > 0 ? array.slice(0, Math.max(0, array.length - n)) : [...array];
}
