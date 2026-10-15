import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curryWithLazy } from './internal/curry-with-lazy';
import { lastLazyValue, lazyEmptyEvaluator } from './internal/lazy-control';

/**
 * Returns the first `n` elements of `array`.
 *
 * Related operations:
 * - `drop` - to skip past the first `n` instead.
 * - `splice` - to remove or insert at an arbitrary index.
 * - `takeLast` - same, but from the end of the array.
 *
 * @param array - The array.
 * @param n - The number of elements to take.
 * @signature
 *    take(array, n)
 * @example
 *    take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
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
 * Related operations:
 * - `drop` - to skip past the first `n` instead.
 * - `splice` - to remove or insert at an arbitrary index.
 * - `takeLast` - same, but from the end of the array.
 *
 * @param n - The number of elements to take.
 * @signature
 *    take(n)(array)
 * @example
 *    pipe([1, 2, 3, 4, 3, 2, 1], take(3)) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function take(
  n: number,
): <T extends IterableContainer>(array: T) => Array<T[number]>;

export function take(...args: ReadonlyArray<unknown>): unknown {
  return curryWithLazy(takeImplementation, args, lazyImplementation);
}

function takeImplementation<T extends IterableContainer>(array: T, n: number): Array<T[number]> {
  return n < 0 ? [] : array.slice(0, n);
}

function lazyImplementation<T>(n: number): LazyEvaluator<T> {
  if (n <= 0) {
    return lazyEmptyEvaluator;
  }

  let remaining = n;
  return (value, _index, _data, slot) => {
    remaining -= 1;
    return remaining <= 0 ? lastLazyValue(value, slot) : value;
  };
}
