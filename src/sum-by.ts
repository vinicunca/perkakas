import type { IterableContainer } from './internal/types/iterable-container';
import { curry } from './curry';

type SumBy<
  T extends IterableContainer,
  U extends bigint | number,
> = T extends readonly []
  ? 0
  : T extends readonly [unknown, ...ReadonlyArray<unknown>]
    ? U
    : 0 | U;

/**
 * Returns the sum of the elements of an array using the provided mapper.
 *
 * Works for both `number` and `bigint` mappers, but not mappers that return both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the mapper; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 *
 * @param callbackfn - Predicate function.
 * @signature
 *   P.sumBy(fn)(array)
 * @example
 *    P.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      P.sumBy(x => x.a)
 *    ) // 9
 * @dataLast
 * @category Array
 */
export function sumBy<T extends IterableContainer>(
  callbackfn: (value: T[number], index: number, data: T) => number,
): (items: T) => SumBy<T, number>;
export function sumBy<T extends IterableContainer>(
  callbackfn: (value: T[number], index: number, data: T) => bigint,
): (items: T) => SumBy<T, bigint>;

/**
 * Returns the sum of the elements of an array using the provided mapper.
 *
 * Works for both `number` and `bigint` mappers, but not mappers that can return both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the mapper; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array.
 * @param callbackfn - Predicate function.
 * @signature
 *   P.sumBy(array, fn)
 * @example
 *    P.sumBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 9
 * @dataFirst
 * @category Array
 */
export function sumBy<T extends IterableContainer>(
  data: T,
  callbackfn: (value: T[number], index: number, data: T) => number,
): SumBy<T, number>;
export function sumBy<T extends IterableContainer>(
  data: T,
  callbackfn: (value: T[number], index: number, data: T) => bigint,
): SumBy<T, bigint>;

export function sumBy(...args: ReadonlyArray<unknown>): unknown {
  return curry(sumByImplementation, args);
}

// eslint-disable-next-line sonar/function-return-type
function sumByImplementation<T>(
  array: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>
  ) => bigint | number,
): bigint | number {
  const iter = array.entries();

  const firstEntry = iter.next();
  if (firstEntry.done ?? false) {
    return 0;
  }

  const {
    value: [, firstValue],
  } = firstEntry;
  let sum = callbackfn(firstValue, 0, array);
  for (const [index, item] of iter) {
    const summand = callbackfn(item, index, array);

    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    sum += summand;
  }

  return sum;
};
