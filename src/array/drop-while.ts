import { purry } from '../function/purry';

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array,
 * until the predicate returns false.
 * The returned array includes the rest of the elements,
 * starting with the element that produced false for the predicate.
 *
 * @param data the array
 * @param predicate the predicate
 * @signature
 *    P.dropWhile(data, predicate)
 * @example
 *    P.dropWhile([1, 2, 10, 3, 4], x => x < 10) // => [10, 3, 4]
 * @dataFirst
 * @category Array
 */
export function dropWhile<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T) => boolean
): Array<T>;

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param predicate the predicate
 * @signature
 *    P.dropWhile(predicate)(data)
 * @example
 *    P.pipe([1, 2, 10, 3, 4], P.dropWhile(x => x < 10))  // => [10, 3, 4]
 * @dataLast
 * @category Array
 */
export function dropWhile<T>(
  predicate: (item: T) => boolean
): (data: ReadonlyArray<T>) => Array<T>;

export function dropWhile(...args: any[]): unknown {
  return purry(dropWhile_, args);
}

function dropWhile_<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T) => boolean,
): Array<T> {
  for (let i = 0; i < data.length; i++) {
    if (!predicate(data[i]!)) {
      return data.slice(i);
    }
  }
  return [];
}
