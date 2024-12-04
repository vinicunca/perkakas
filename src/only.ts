import type { IterableContainer } from './internal/types/iterable-container';

import { curry } from './curry';

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
 *
 * @param array - The target array.
 * @signature
 *    P.only(array)
 * @example
 *    P.only([]) // => undefined
 *    P.only([1]) // => 1
 *    P.only([1, 2]) // => undefined
 * @dataFirst
 * @category Array
 */
export function only<T extends IterableContainer>(array: Readonly<T>): Only<T>;

/**
 * Returns the first and only element of `array`, or undefined otherwise.
 *
 * @signature
 *    P.only()(array)
 * @example
 *    P.pipe([], P.only()); // => undefined
 *    P.pipe([1], P.only()); // => 1
 *    P.pipe([1, 2], P.only()); // => undefined
 * @dataLast
 * @category Array
 */
export function only<T extends IterableContainer>(): (
  array: Readonly<T>,
) => Only<T>;

export function only(...args: ReadonlyArray<unknown>): unknown {
  return curry(onlyImplementation, args);
}

function onlyImplementation<T>(array: ReadonlyArray<T>): T | undefined {
  return array.length === 1 ? array[0] : undefined;
}
