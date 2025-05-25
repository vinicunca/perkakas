import type { IsNumericLiteral } from 'type-fest';
import type { ArrayRequiredPrefix } from './internal/types/array-required-prefix';
import type { IterableContainer } from './internal/types/iterable-container';
import { curry } from './curry';

/**
 * Checks if the given array has at least the defined number of elements. When
 * the minimum used is a literal (e.g. `3`) the output is refined accordingly so
 * that those indices are defined when accessing the array even when using
 * typescript's 'noUncheckedIndexAccess'.
 *
 * @param data - The input array.
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`. When `minimum`
 * is a literal value, the output is narrowed to ensure the first items are
 * guaranteed.
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
export function hasAtLeast<T extends IterableContainer, N extends number>(
  data: IterableContainer | T,
  minimum: IsNumericLiteral<N> extends true ? N : never,
): data is ArrayRequiredPrefix<T, N>;
export function hasAtLeast(data: IterableContainer, minimum: number): boolean;

/**
 * Checks if the given array has at least the defined number of elements. When
 * the minimum used is a literal (e.g. `3`) the output is refined accordingly so
 * that those indices are defined when accessing the array even when using
 * typescript's 'noUncheckedIndexAccess'.
 *
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`. When `minimum`
 * is a literal value, the output is narrowed to ensure the first items are
 * guaranteed.
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
  minimum: IsNumericLiteral<N> extends true ? N : never,
): <T extends IterableContainer>(
  data: IterableContainer | T,
) => data is ArrayRequiredPrefix<T, N>;
export function hasAtLeast(
  minimum: number,
): (data: IterableContainer) => boolean;

export function hasAtLeast(...args: ReadonlyArray<unknown>): unknown {
  return curry(hasAtLeastImplementation, args);
}

function hasAtLeastImplementation(
  data: IterableContainer,
  minimum: number,
): boolean {
  return data.length >= minimum;
}
