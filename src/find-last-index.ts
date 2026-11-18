import type { ArrayCallback } from './internal/types/callback';
import type { DataLastBuilder } from './internal/types/data-last-builder';

/**
 * Iterates the array in reverse order and returns the index of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, -1 is returned.
 *
 * See also `findLast` which returns the value of last element that satisfies
 * the testing function (rather than its index).
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise.
 * @returns The index of the last (highest-index) element in the array that
 * passes the test. Otherwise -1 if no matching element is found.
 * @signature
 *    findLastIndex(data, predicate)
 * @example
 *    findLastIndex([1, 3, 4, 6], n => n % 2 === 1) // => 1
 * @dataFirst
 * @category Array
 */
export function findLastIndex<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): number;

/**
 * Iterates the array in reverse order and returns the index of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, -1 is returned.
 *
 * See also `findLast` which returns the value of last element that satisfies
 * the testing function (rather than its index).
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise.
 * @returns The index of the last (highest-index) element in the array that
 * passes the test. Otherwise -1 if no matching element is found.
 * @signature
 *    findLastIndex(predicate)(data)
 * @example
 *    pipe(
 *      [1, 3, 4, 6],
 *      findLastIndex(n => n % 2 === 1)
 *    ) // => 1
 * @dataLast
 * @category Array
 */
export function findLastIndex<T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => number;

export function findLastIndex(
  dataOrPredicate:
    ReadonlyArray<unknown> | ArrayCallback<ReadonlyArray<unknown>, boolean>,
  predicate?: ArrayCallback<ReadonlyArray<unknown>, boolean>,
): unknown {
  return typeof dataOrPredicate === 'function'
    // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
    ? dataLast(dataOrPredicate)
    : findLastIndexImplementation(
        dataOrPredicate,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        predicate,
      );
}

const dataLast: DataLastBuilder<typeof findLastIndexImplementation> =
  (predicate) => (data) =>
    findLastIndexImplementation(data, predicate);

function findLastIndexImplementation<T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): number {
  for (let i = data.length - 1; i >= 0; i--) {
    if (predicate(data[i]!, i, data)) {
      return i;
    }
  }

  return -1;
}
