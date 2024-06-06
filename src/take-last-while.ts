import { curry } from './curry';

/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    P.takeLastWhile(data, predicate)
 * @example
 *    P.takeLastWhile([1, 2, 10, 3, 4, 5], x => x < 10) // => [3, 4, 5]
 * @dataFirst
 * @category Array
 */
export function takeLastWhile<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T>;

/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param predicate - The predicate.
 * @signature
 *    P.takeLastWhile(predicate)(data)
 * @example
 *    P.pipe([1, 2, 10, 3, 4, 5], P.takeLastWhile(x => x < 10))  // => [3, 4, 5]
 * @dataLast
 * @category Array
 */
export function takeLastWhile<T>(
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => Array<T>;

export function takeLastWhile(...args: ReadonlyArray<unknown>): unknown {
  return curry(takeLastWhileImplementation, args);
}

function takeLastWhileImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T> {
  for (let i = data.length - 1; i >= 0; i--) {
    if (!predicate(data[i]!, i, data)) {
      return data.slice(i + 1);
    }
  }
  return [...data];
}
