import type { LazyEvaluator } from '../pipe';

import { purry } from '../purry';
import { reduceLazy } from '../utils/reduce-lazy';

/**
 * Returns the first `n` elements of `array`.
 * @param array the array
 * @param n the number of elements to take
 * @signature
 *    take(array, n)
 * @example
 *    take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function take<T>(array: ReadonlyArray<T>, n: number): Array<T>;

/**
 * Returns the first `n` elements of `array`.
 * @param n the number of elements to take
 * @signature
 *    take(n)(array)
 * @example
 *    pipe([1, 2, 3, 4, 3, 2, 1], take(n)) // => [1, 2, 3]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function take<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;

export function take(...args: Array<any>): unknown {
  return purry(take_, args, take.lazy);
}

function take_<T>(array: ReadonlyArray<T>, n: number): Array<T> {
  return reduceLazy(array, take.lazy(n));
}

export namespace take {
  export function lazy<T>(n: number): LazyEvaluator<T> {
    if (n <= 0) {
      return () => ({ done: true, hasNext: false });
    }

    let remaining = n;
    return (value) => {
      remaining -= 1;
      return { done: remaining <= 0, hasNext: true, next: value };
    };
  }
}
