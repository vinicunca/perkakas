import type { NonEmptyArray } from '../utils/types';
import { purry } from '../function';

/**
 * Gets the last element of `array`.
 * Note: In `pipe`, use `last()` form instead of `last`. Otherwise, the inferred type is lost.
 * @param array the array
 * @signature
 *    P.last(array)
 * @example
 *    P.last([1, 2, 3]) // => 3
 *    P.last([]) // => undefined
 *    P.pipe(
 *      [1, 2, 4, 8, 16],
 *      P.filter(x => x > 3),
 *      P.last(),
 *      x => x + 1
 *    ); // => 17
 *
 * @category Array
 * @pipeable
 */
export function last<T>(array: NonEmptyArray<T>): T;
export function last<T>(array: ReadonlyArray<T>): T | undefined;
export function last<T>(): (array: ReadonlyArray<T>) => T | undefined;
export function last(...args: any[]) {
  return purry(_last, args);
}

function _last<T>(array: Array<T>) {
  return array[array.length - 1];
}
