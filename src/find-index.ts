import type { ArrayCallback } from './internal/types/callback';
import type { DataLastBuilder } from './internal/types/data-last-builder';

/**
 * Returns the index of the first element in an array that satisfies the
 * provided testing function. If no elements satisfy the testing function, -1 is
 * returned.
 *
 * See also the `find` method, which returns the first element that satisfies
 * the testing function (rather than its index).
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return a `true` to indicate a matching element has been found, and a
 * `false` otherwise.
 * @returns The index of the first element in the array that passes the test.
 * Otherwise, -1.
 * @signature
 *    findIndex(data, predicate)
 * @example
 *    findIndex([1, 3, 4, 6], n => n % 2 === 0) // => 2
 * @dataFirst
 * @category Array
 */
export function findIndex<T>(
  data: ReadonlyArray<T>,
  predicate: ArrayCallback<ReadonlyArray<T>, boolean>,
): number;

/**
 * Returns the index of the first element in an array that satisfies the
 * provided testing function. If no elements satisfy the testing function, -1 is
 * returned.
 *
 * See also the `find` method, which returns the first element that satisfies
 * the testing function (rather than its index).
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return a `true` to indicate a matching element has been found, and a
 * `false` otherwise.
 * @returns The index of the first element in the array that passes the test.
 * Otherwise, -1.
 * @signature
 *    findIndex(predicate)(data)
 * @example
 *    pipe(
 *      [1, 3, 4, 6],
 *      findIndex(n => n % 2 === 0)
 *    ); // => 2
 * @dataLast
 * @category Array
 */
export function findIndex<T>(
  predicate: ArrayCallback<ReadonlyArray<T>, boolean>,
): (data: ReadonlyArray<T>) => number;

export function findIndex(
  dataOrPredicate:
    ReadonlyArray<unknown> | ArrayCallback<ReadonlyArray<unknown>, boolean>,
  predicate?: ArrayCallback<ReadonlyArray<unknown>, boolean>,
): unknown {
  return typeof dataOrPredicate === 'function'
    // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
    ? dataLast(dataOrPredicate)
    : findIndexImplementation(
        dataOrPredicate,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        predicate,
      );
}

const dataLast: DataLastBuilder<typeof findIndexImplementation> =
  (predicate) => (data) =>
    findIndexImplementation(data, predicate);

const findIndexImplementation = <T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): number => data.findIndex(predicate);
