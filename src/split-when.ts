import type { ArrayCallback } from './internal/types/callback';
import type { DataLastBuilder } from './internal/types/data-last-builder';

/**
 * Splits a given array at the first index where the given predicate returns true.
 *
 * @param data - The array to split.
 * @param predicate - The predicate.
 * @signature
 *    splitWhen(data, predicate)
 * @example
 *    splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @dataFirst
 * @category Array
 */
export function splitWhen<T>(
  data: ReadonlyArray<T>,
  predicate: ArrayCallback<ReadonlyArray<T>, boolean>,
): [Array<T>, Array<T>];

/**
 * Splits a given array at an index where the given predicate returns true.
 *
 * @param predicate - The predicate.
 * @signature
 *    splitWhen(predicate)(data)
 * @example
 *    splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
export function splitWhen<T>(
  predicate: ArrayCallback<ReadonlyArray<T>, boolean>,
): (data: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function splitWhen(
  dataOrPredicate:
    ReadonlyArray<unknown> | ArrayCallback<ReadonlyArray<unknown>, boolean>,
  predicate?: ArrayCallback<ReadonlyArray<unknown>, boolean>,
): unknown {
  return typeof dataOrPredicate === 'function'
    // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
    ? dataLast(dataOrPredicate)
    : splitWhenImplementation(
        dataOrPredicate,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        predicate,
      );
}

const dataLast: DataLastBuilder<typeof splitWhenImplementation>
  = (predicate) => (data) =>
    splitWhenImplementation(data, predicate);

function splitWhenImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): [Array<T>, Array<T>] {
  const index = data.findIndex(predicate);
  return index === -1
    ? [
        data.concat(),
        [],
      ]
    : [
        data.slice(0, index),
        data.slice(index),
      ];
}
