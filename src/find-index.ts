import { curry } from './curry';

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
 *    P.findIndex(data, predicate)
 * @example
 *    P.findIndex([1, 3, 4, 6], n => n % 2 === 0) // => 2
 * @dataFirst
 * @category Array
 */
export function findIndex<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
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
 *    P.findIndex(predicate)(data)
 * @example
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.findIndex(n => n % 2 === 0)
 *    ); // => 2
 * @dataLast
 * @category Array
 */
export function findIndex<T>(
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => number;

export function findIndex(...args: ReadonlyArray<unknown>): unknown {
  return curry(findIndexImplementation, args);
}

function findIndexImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): number {
  return data.findIndex(predicate);
}
