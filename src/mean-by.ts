import type { ArrayCallback } from './internal/types/callback';
import type { DataLastBuilder } from './internal/types/data-last-builder';

/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param callbackfn - Predicate function.
 * @signature
 *   meanBy(callbackfn)(data)
 * @example
 *    pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      meanBy(x => x.a)
 *    ) // 3
 * @dataLast
 * @category Array
 */

export function meanBy<T>(
  callbackfn: ArrayCallback<ReadonlyArray<T>, number>,
): (data: ReadonlyArray<T>) => number;

/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param data - The array.
 * @param callbackfn - Predicate function.
 * @signature
 *   meanBy(data, callbackfn)
 * @example
 *    meanBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 3
 * @dataFirst
 * @category Array
 */

export function meanBy<T>(
  data: ReadonlyArray<T>,
  callbackfn: ArrayCallback<ReadonlyArray<T>, number>,
): number;

export function meanBy(
  dataOrCallbackfn:
    ReadonlyArray<unknown> | ArrayCallback<ReadonlyArray<unknown>, number>,
  callbackfn?: ArrayCallback<ReadonlyArray<unknown>, number>,
): unknown {
  return typeof dataOrCallbackfn === 'function'
    // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
    ? dataLast(dataOrCallbackfn)
    : meanByImplementation(
        dataOrCallbackfn,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        callbackfn,
      );
}

const dataLast: DataLastBuilder<typeof meanByImplementation>
  = (callbackfn) => (data) =>
    meanByImplementation(data, callbackfn);

function meanByImplementation<T>(data: ReadonlyArray<T>, callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => number): number {
  if (data.length === 0) {
    return NaN;
  }

  let sum = 0;

  let index = 0;
  for (const item of data) {
    sum += callbackfn(item, index, data);
    index += 1;
  }

  return sum / data.length;
}
