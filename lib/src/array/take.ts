import { type LazyResult } from '../utils/reduce-lazy';
import { purry } from '../function';
import { _reduceLazy } from '../utils/reduce-lazy';

/**
 * Returns the first `n` elements of `array`.
 * @param array the array
 * @param n the number of elements to take
 * @signature
 *    P.take(array, n)
 * @example
 *    P.take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function take<T>(array: ReadonlyArray<T>, n: number): Array<T>;

/**
 * Returns the first `n` elements of `array`.
 * @param n the number of elements to take
 * @signature
 *    P.take(n)(array)
 * @example
 *    P.pipe([1, 2, 3, 4, 3, 2, 1], P.take(n)) // => [1, 2, 3]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function take<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;

export function take() {
  return purry(_take, arguments, take.lazy);
}

function _take<T>(array: Array<T>, n: number) {
  return _reduceLazy(array, take.lazy(n));
}

export namespace take {
  export function lazy<T>(n: number) {
    return (value: T): LazyResult<T> => {
      if (n === 0) {
        return {
          done: true,
          hasNext: false,
        };
      }
      n--;
      if (n === 0) {
        return {
          done: true,
          hasNext: true,
          next: value,
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
