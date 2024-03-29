import type { IterableContainer } from './_types';

import { purry } from './purry';

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
 *
 * @param array the target array
 * @signature
 *  only(array)
 * @example
 *  import { only } from '@vinicunca/perkakas';
 *
 *  only([]); // => undefined
 *  only([1]); // => 1
 *  only([1, 2]); // => undefined
 * @pipeable
 * @category Array
 * @dataFirst
 */
export function only<T extends IterableContainer>(array: Readonly<T>): Only<T>;

/**
 * Returns the first and only element of `array`, or undefined otherwise.
 * Note: In `pipe`, use `only()` form instead of `only`. Otherwise, the
 * inferred type is lost.
 *
 * @signature
 *  only(array)
 * @example
 *  import { only } from '@vinicunca/perkakas';
 *
 *  only([]); // => undefined
 *  only([1]); // => 1
 *  only([1, 2]); // => undefined
 * @pipeable
 * @category Array
 * @dataLast
 */
export function only<T extends IterableContainer>(): (
  array: Readonly<T>
) => Only<T>;

export function only(...args: Array<any>): unknown {
  return purry(only_, args);
}

function only_<T>(array: ReadonlyArray<T>): T | undefined {
  return array.length === 1 ? array[0] : undefined;
}
