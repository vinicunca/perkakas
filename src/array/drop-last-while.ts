import { purry } from '../function/purry';

/**
 * Removes elements from the end of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array starting from the end and moving towards the beginning, until the predicate returns false. The returned array includes elements from the beginning of the array, up to and including the element that produced false for the predicate.
 *
 * @param data the array
 * @param predicate the predicate
 * @signature
 *    P.dropLastWhile(data, predicate)
 * @example
 *    P.dropLastWhile([1, 2, 10, 3, 4], x => x < 10) // => [1, 2, 10]
 * @dataFirst
 * @category Array
 */
export function dropLastWhile<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T) => boolean
): Array<T>;

/**
 * Removes elements from the end of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array starting from the end and moving towards the beginning, until the predicate returns false. The returned array includes elements from the beginning of the array, up to and including the element that produced false for the predicate.
 *
 * @param predicate the predicate
 * @signature
 *    P.dropLastWhile(predicate)(data)
 * @example
 *    P.pipe([1, 2, 10, 3, 4], P.dropLastWhile(x => x < 10))  // => [1, 2, 10]
 * @dataLast
 * @category Array
 */
export function dropLastWhile<T>(
  predicate: (item: T) => boolean
): (data: ReadonlyArray<T>) => Array<T>;

export function dropLastWhile(...args: any[]) {
  return purry(_dropLastWhile, args);
}

function _dropLastWhile<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T) => boolean,
): Array<T> {
  for (let i = data.length - 1; i >= 0; i--) {
    if (!predicate(data[i]!)) {
      return data.slice(0, i + 1);
    }
  }
  return [];
}
