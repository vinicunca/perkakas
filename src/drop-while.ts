import { curry } from './curry';

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    P.dropWhile(data, predicate)
 * @example
 *    P.dropWhile([1, 2, 10, 3, 4], x => x < 10) // => [10, 3, 4]
 * @dataFirst
 * @category Array
 */
export function dropWhile<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T>;

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    P.dropWhile(predicate)(data)
 * @example
 *    P.pipe([1, 2, 10, 3, 4], P.dropWhile(x => x < 10))  // => [10, 3, 4]
 * @dataLast
 * @category Array
 */
export function dropWhile<T>(
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => Array<T>;

export function dropWhile(...args: ReadonlyArray<unknown>): unknown {
  return curry(dropWhileImplementation, args);
}

function dropWhileImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T> {
  for (const [index, item] of data.entries()) {
    if (!predicate(item, index, data)) {
      return data.slice(index);
    }
  }
  return [];
}
