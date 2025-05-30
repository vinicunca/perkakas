import { curry } from './curry';

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
 *    P.findLastIndex(data, predicate)
 * @example
 *    P.findLastIndex([1, 3, 4, 6], n => n % 2 === 1) // => 1
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
 *    P.findLastIndex(fn)(items)
 * @example
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.findLastIndex(n => n % 2 === 1)
 *    ) // => 1
 * @dataLast
 * @category Array
 */
export function findLastIndex<T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): (array: ReadonlyArray<T>) => number;

export function findLastIndex(...args: ReadonlyArray<unknown>): unknown {
  return curry(findLastIndexImplementation, args);
}

function findLastIndexImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): number {
  // TODO: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.findLastIndex` here.

  for (let i = data.length - 1; i >= 0; i--) {
    if (predicate(data[i]!, i, data)) {
      return i;
    }
  }

  return -1;
};
