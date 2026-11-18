import type { ArrayCallback } from './internal/types/callback';
import type { DataLastBuilder } from './internal/types/data-last-builder';
import type { IterableContainer } from './internal/types/iterable-container';

type SumBy<
  T extends IterableContainer,
  U extends bigint | number,
> = T extends readonly []
  ? 0
  : T extends readonly [unknown, ...(ReadonlyArray<unknown>)]
    ? U
    : U | 0;

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
 * @param callbackfn - Predicate function.
 * @signature
 *   sumBy(callbackfn)(data)
 * @example
 *    pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      sumBy(x => x.a)
 *    ) // 9
 *
 *    pipe(
 *      [{a: 5n}, {a: 1n}, {a: 3n}],
 *      sumBy(x => x.a)
 *    ) // 9n
 * @dataLast
 * @category Array
 */
export function sumBy<T extends IterableContainer>(
  callbackfn: ArrayCallback<T, number>,
): (data: T) => SumBy<T, number>;
export function sumBy<T extends IterableContainer>(
  callbackfn: ArrayCallback<T, bigint>,
): (data: T) => SumBy<T, bigint>;

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
 *   sumBy(data, callbackfn)
 * @example
 *    sumBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 9
 *    sumBy(
 *      [{a: 5n}, {a: 1n}, {a: 3n}],
 *      x => x.a
 *    ) // 9n
 * @dataFirst
 * @category Array
 */
export function sumBy<T extends IterableContainer>(
  data: T,
  callbackfn: ArrayCallback<T, number>,
): SumBy<T, number>;
export function sumBy<T extends IterableContainer>(
  data: T,
  callbackfn: ArrayCallback<T, bigint>,
): SumBy<T, bigint>;

export function sumBy(
  dataOrCallbackfn:
    IterableContainer | ArrayCallback<IterableContainer, bigint | number>,
  callbackfn?: ArrayCallback<IterableContainer, bigint | number>,
): unknown {
  return typeof dataOrCallbackfn === 'function'
    // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
    ? dataLast(dataOrCallbackfn)
    : sumByImplementation(
        dataOrCallbackfn,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        callbackfn,
      );
}

const dataLast: DataLastBuilder<typeof sumByImplementation>
  = (callbackfn) => (data) =>
    sumByImplementation(data, callbackfn);

function sumByImplementation<T>(data: ReadonlyArray<T>, callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => bigint | number): bigint | number {
  let sum: bigint | number = 0;

  let index = 0;
  for (const item of data) {
    const summand = callbackfn(item, index, data);

    sum = index === 0
      ? summand
      // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
      : sum + summand;
    index += 1;
  }

  return sum;
}
