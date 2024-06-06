import type { LazyEvaluator } from './pipe';

import { curry } from './curry';
import { SKIP_ITEM, lazyIdentityEvaluator } from './helpers/utility-evaluators';

/**
 * Removes first `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    P.drop(array, n)
 * @example
 *    P.drop([1, 2, 3, 4, 5], 2) // => [3, 4, 5]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function drop<T>(array: ReadonlyArray<T>, n: number): Array<T>;

/**
 * Removes first `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    P.drop(n)(array)
 * @example
 *    P.drop(2)([1, 2, 3, 4, 5]) // => [3, 4, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
export function drop<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;

export function drop(...args: ReadonlyArray<unknown>): unknown {
  return curry(dropImplementation, args, lazyImplementation);
}

function dropImplementation<T>(array: ReadonlyArray<T>, n: number): Array<T> {
  return n < 0 ? [...array] : array.slice(n);
}

function lazyImplementation<T>(n: number): LazyEvaluator<T> {
  if (n <= 0) {
    return lazyIdentityEvaluator;
  }

  let left = n;
  return (value) => {
    if (left > 0) {
      left -= 1;
      return SKIP_ITEM;
    }
    return { done: false, hasNext: true, next: value };
  };
}
