import type { IterableContainer } from 'src/utils/types';

import { purry } from '../function/purry';

type Only<T extends IterableContainer> = T extends
  | readonly [...Array<unknown>, unknown, unknown]
  | readonly []
  | readonly [unknown, ...Array<unknown>, unknown]
  | readonly [unknown, unknown, ...Array<unknown>]
  ? undefined
  : T extends readonly [unknown]
    ? T[number]
    : T[number] | undefined;

/**
 * Returns the first and only element of `array`, or undefined otherwise.
 * Note: In `pipe`, use `only()` form instead of `only`. Otherwise, the
 * inferred type is lost.
 * @param array the target array
 * @signature
 *    P.only(array)
 * @example
 *    P.only([]) // => undefined
 *    P.only([1]) // => 1
 *    P.only([1, 2]) // => undefined
 * @pipeable
 * @category Array
 * @dataFirst
 */
export function only<T extends IterableContainer>(array: Readonly<T>): Only<T>;

/**
 * Returns the first and only element of `array`, or undefined otherwise.
 * Note: In `pipe`, use `only()` form instead of `only`. Otherwise, the
 * inferred type is lost.
 * @param array the target array
 * @signature
 *    P.only(array)
 * @example
 *    P.only([]) // => undefined
 *    P.only([1]) // => 1
 *    P.only([1, 2]) // => undefined
 * @pipeable
 * @category Array
 * @dataLast
 */
export function only<T extends IterableContainer>(): (
  array: Readonly<T>
) => Only<T>;

export function only(...args: any[]) {
  return purry(_only, args);
}

function _only<T>(array: ReadonlyArray<T>) {
  if (array.length === 1) {
    return array[0];
  }
  return undefined;
}
