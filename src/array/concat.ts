import { purry } from '../function/purry';

/**
 * Combines two arrays.
 * @param arr1 the first array
 * @param arr2 the second array
 * @signature
 *    P.concat(arr1, arr2);
 * @example
 *    P.concat([1, 2, 3], ['a']) // [1, 2, 3, 'a']
 * @dataFirst
 * @category Array
 */
export function concat<T, K>(
  arr1: ReadonlyArray<T>,
  arr2: ReadonlyArray<K>
): Array<K | T>;

/**
 * Combines two arrays.
 * @param arr2 the second array
 * @signature
 *    P.concat(arr2)(arr1);
 * @example
 *    P.concat(['a'])([1, 2, 3]) // [1, 2, 3, 'a']
 * @dataLast
 * @category Array
 */
export function concat<T, K>(
  arr2: ReadonlyArray<K>
): (arr1: ReadonlyArray<T>) => Array<K | T>;

export function concat(...args: Array<any>): unknown {
  return purry(concat_, args);
}

function concat_<T, K>(
  arr1: ReadonlyArray<T>,
  arr2: ReadonlyArray<K>,
): Array<K | T> {
  return (arr1 as Array<K | T>).concat(arr2);
}
