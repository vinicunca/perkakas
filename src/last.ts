import type { LastArrayElement } from 'type-fest';

import type { IterableContainer } from './helpers/types';

import { curry } from './curry';

type Last<T extends IterableContainer> = LastArrayElement<
  T,
  // Type-fest's LastArrayElement assumes a looser typescript configuration
  // where `noUncheckedIndexedAccess` is disabled. To support the stricter
  // configuration we assume we need to assign the "LastArrayElement" param to
  // `undefined`, but only if the array isn't empty.
  T extends readonly [] ? never : undefined
>;

/**
 * Gets the last element of `array`.
 *
 * @param data - The array.
 * @signature
 *    P.last(array)
 * @example
 *    P.last([1, 2, 3]) // => 3
 *    P.last([]) // => undefined
 * @dataFirst
 * @category Array
 */
export function last<T extends IterableContainer>(data: T): Last<T>;

/**
 * Gets the last element of `array`.
 *
 * @signature
 *    P.last()(array)
 * @example
 *    P.pipe(
 *      [1, 2, 4, 8, 16],
 *      P.filter(x => x > 3),
 *      P.last(),
 *      x => x + 1
 *    ); // => 17
 * @dataLast
 * @category Array
 */
export function last(): <T extends IterableContainer>(data: T) => Last<T>;

export function last(...args: ReadonlyArray<unknown>): unknown {
  return curry(lastImplementation, args);
}

function lastImplementation<T>(array: ReadonlyArray<T>): T | undefined {
  return array.at(-1);
};
