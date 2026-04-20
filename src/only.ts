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
 *    only(array)
 * @example
 *    only([]) // => undefined
 *    only([1]) // => 1
 *    only([1, 2]) // => undefined
 * @dataFirst
 * @category Array
 */
export function only<T extends IterableContainer>(array: Readonly<T>): Only<T>;

/**
 * Returns the first and only element of `array`, or undefined otherwise.
 *
 * @signature
 *    only()(array)
 * @example
 *    pipe([], only()); // => undefined
 *    pipe([1], only()); // => 1
 *    pipe([1, 2], only()); // => undefined
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
