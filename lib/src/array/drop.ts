import { type LazyResult, _reduceLazy } from '../utils/reduce-lazy';
import { purry } from '../function';

/**
 * Removes first `n` elements from the `array`.
 * @param array the target array
 * @param n the number of elements to skip
 * @signature
 *    P.drop(array, n)
 * @example
 *    P.drop([1, 2, 3, 4, 5], 2) // => [3, 4, 5]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function drop<T>(array: ReadonlyArray<T>, n: number): Array<T>;

/**
 * Removes first `n` elements from the `array`.
 * @param n the number of elements to skip
 * @signature
 *    P.drop(n)(array)
 * @example
 *    P.drop(2)([1, 2, 3, 4, 5]) // => [3, 4, 5]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function drop<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;

export function drop(...args: any[]) {
  return purry(_drop, args, drop.lazy);
}

function _drop<T>(array: Array<T>, n: number) {
  return _reduceLazy(array, drop.lazy(n));
}

export namespace drop {
  export function lazy<T>(n: number) {
    let left = n;
    return (value: T): LazyResult<T> => {
      if (left > 0) {
        left--;
        return {
          done: false,
          hasNext: false,
        };
      }
      return {
        done: false,
        hasNext: true,
        next: value,
      };
    };
  }
}
