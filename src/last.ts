import type { NonEmptyArray } from './_types';

import { purry } from '../purry';

/**
 * Gets the last element of `array`.
 *
 * @param array the array
 * @signature
 *    last(array)
 * @example
 *    last([1, 2, 3]) // => 3
 *    last([]) // => undefined
 * @category Array
 * @pipeable
 * @dataFirst
 */
export function last<T>(array: Readonly<NonEmptyArray<T>>): T;
export function last<T>(array: ReadonlyArray<T>): T | undefined;

/**
 * Gets the last element of `array`.
 *
 * @signature
 *    last()(array)
 * @example
 *    pipe(
 *      [1, 2, 4, 8, 16],
 *      filter(x => x > 3),
 *      last(),
 *      x => x + 1
 *    ); // => 17
 * @category Array
 * @pipeable
 * @dataLast
 */
export function last<T>(): (array: ReadonlyArray<T>) => T | undefined;

export function last(...args: Array<any>): unknown {
  return purry(last_, args);
}

function last_<T>(array: ReadonlyArray<T>): T | undefined {
  return array[array.length - 1];
}
