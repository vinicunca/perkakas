import { curry } from './curry';

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    P.takeWhile(data, predicate)
 * @example
 *    P.takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
export function takeWhile<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T>;

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param predicate - The predicate.
 * @signature
 *    P.takeWhile(predicate)(data)
 * @example
 *    P.pipe([1, 2, 3, 4, 3, 2, 1], P.takeWhile(x => x !== 4))  // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
export function takeWhile<T>(
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): (array: ReadonlyArray<T>) => Array<T>;

export function takeWhile(...args: ReadonlyArray<unknown>): unknown {
  return curry(takeWhileImplementation, args);
}

function takeWhileImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T> {
  const ret: Array<T> = [];
  for (const [index, item] of data.entries()) {
    if (!predicate(item, index, data)) {
      break;
    }
    ret.push(item);
  }
  return ret;
}
