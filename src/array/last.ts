import type { NonEmptyArray } from '../utils/types';

import { purry } from '../function/purry';

/**
 * Gets the last element of `array`.
 * @param array the array
 * @signature
 *    P.last(array)
 * @example
 *    P.last([1, 2, 3]) // => 3
 *    P.last([]) // => undefined
 * @category Array
 * @pipeable
 * @dataFirst
 */
export function last<T>(array: Readonly<NonEmptyArray<T>>): T;
export function last<T>(array: ReadonlyArray<T>): T | undefined;

/**
 * Gets the last element of `array`.
 * @param array the array
 * @signature
 *    P.last()(array)
 * @example
 *    P.pipe(
 *      [1, 2, 4, 8, 16],
 *      P.filter(x => x > 3),
 *      P.last(),
 *      x => x + 1
 *    ); // => 17
 * @category Array
 * @pipeable
 * @dataLast
 */
export function last<T>(): (array: ReadonlyArray<T>) => T | undefined;

export function last(...args: any[]): unknown {
  return purry(last_, args);
}

function last_<T>(array: ReadonlyArray<T>): T | undefined {
  return array[array.length - 1];
}
