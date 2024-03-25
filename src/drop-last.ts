import { purry } from './purry';

/**
 * Removes last `n` elements from the `array`.
 *
 * @param array the target array
 * @param n the number of elements to skip
 * @signature
 *  dropLast(array, n)
 * @example
 *  import { dropLast } from '@vinicunca/perkakas';
 *
 *  dropLast([1, 2, 3, 4, 5], 2); // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
export function dropLast<T>(array: ReadonlyArray<T>, n: number): Array<T>;

/**
 * Removes last `n` elements from the `array`.
 *
 * @param n the number of elements to skip
 * @signature
 *  dropLast(n)(array)
 * @example
 *  import { dropLast } from '@vinicunca/perkakas';
 *
 *  dropLast(2)([1, 2, 3, 4, 5]); // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
export function dropLast<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;

export function dropLast(...args: Array<any>): unknown {
  return purry(dropLast_, args);
}

function dropLast_<T>(array: ReadonlyArray<T>, n: number): Array<T> {
  const copy = array.slice();
  if (n > 0) {
    copy.splice(-n);
  }
  return copy;
}
