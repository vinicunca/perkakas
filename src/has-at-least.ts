import type { ReadonlyTuple } from 'type-fest';

import { purry } from './purry';

type ArrayMinN<T, N extends number> = number extends N
  ? // We can only compute the type for a literal number!
  Array<T>
  : // I don't know why we need to special-case the 0 case, but otherwise
// typescript complains we have a deep recursion.
  N extends 0
    ? Array<T>
    : [...ReadonlyTuple<T, N>, ...Array<T>];

/**
 * Checks if the given array has at least the defined number of elements, and
 * refines the output type accordingly so that those indices are defined when
 * accessing the array even when using typescript's 'noUncheckedIndexAccess'.
 *
 * @param data the input array
 * @param minimum the minimum number of elements the array must have
 * @return true if the array's length is *at least* `minimum`.
 * @signature
 *   P.hasAtLeast(data, minimum)
 * @example
 *   P.hasAtLeast([], 4); // => false
 *
 *   const data: number[] = [1,2,3,4];
 *   P.hasAtLeast(data, 1); // => true
 *   data[0]; // 1, with type `number`
 * @dataFirst
 * @category Array
 */
export function hasAtLeast<T, N extends number>(
  data: ReadonlyArray<T>,
  minimum: N
  // @ts-expect-error recursive error after upgrading TS to 5.4.2
): data is ArrayMinN<T, N>;

/**
 * Checks if the given array has at least the defined number of elements, and
 * refines the output type accordingly so that those indices are defined when
 * accessing the array even when using typescript's 'noUncheckedIndexAccess'.
 *
 * @param minimum the minimum number of elements the array must have
 * @return true if the array's length is *at least* `minimum`.
 * @signature
 *   P.hasAtLeast(minimum)(data)
 * @example
 *   P.pipe([], P.hasAtLeast(4)); // => false
 *
 *   const data = [[1,2], [3], [4,5]];
 *   P.pipe(
 *     data,
 *     P.filter(P.hasAtLeast(2)),
 *     P.map(([, second]) => second),
 *   ); // => [2,5], with type `number[]`
 * @dataLast
 * @category Array
 */
export function hasAtLeast<N extends number>(
  minimum: N
  // @ts-expect-error recursive error after upgrading TS to 5.4.2
): <T>(data: ReadonlyArray<T>) => data is ArrayMinN<T, N>;

export function hasAtLeast(...args: ReadonlyArray<unknown>): unknown {
  return purry(hasAtLeastImplementation, args);
}

function hasAtLeastImplementation<T, N extends number>(data: ReadonlyArray<T>,
  // @ts-expect-error recursive error after upgrading TS to 5.4.2
  minimum: N): data is ArrayMinN<T, N> {
  return data.length >= minimum;
}
