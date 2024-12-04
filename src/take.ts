import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './pipe';

import { curry } from './curry';
import { lazyEmptyEvaluator } from './internal/utility-evaluators';

/**
 * Returns the first `n` elements of `array`.
 *
 * @param array - The array.
 * @param n - The number of elements to take.
 * @signature
 *    P.take(array, n)
 * @example
 *    P.take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function take<T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]>;

/**
 * Returns the first `n` elements of `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    P.take(n)(array)
 * @example
 *    P.pipe([1, 2, 3, 4, 3, 2, 1], P.take(n)) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function take(
  n: number,
): <T extends IterableContainer>(array: T) => Array<T[number]>;

export function take(...args: ReadonlyArray<unknown>): unknown {
  return curry(takeImplementation, args, lazyImplementation);
}

function takeImplementation<T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]> {
  return n < 0 ? [] : array.slice(0, n);
}

function lazyImplementation<T>(n: number): LazyEvaluator<T> {
  if (n <= 0) {
    return lazyEmptyEvaluator;
  }

  let remaining = n;
  return (value) => {
    remaining -= 1;
    return { done: remaining <= 0, hasNext: true, next: value };
  };
}
