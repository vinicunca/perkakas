import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curryWithLazy } from './internal/curry-with-lazy';
import { SKIP_ITEM } from './internal/lazy-control';

/**
 * Removes last `n` elements from the `array`.
 *
 * Related operations:
 * - `drop` - same, but from the start of the array.
 * - `splice` - to remove or insert at an arbitrary index.
 * - `takeLast` - to keep the last `n` instead.
 *
 * @param array - The target array.
 * @param n - The number of elements to drop, rounded up. If `n` is 0 or less (or `NaN`) no elements are dropped and a *clone* of the input is returned.
 * @signature
 *    dropLast(array, n)
 * @example
 *    dropLast([1, 2, 3, 4, 5], 2) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function dropLast<T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]>;

/**
 * Removes last `n` elements from the `array`.
 *
 * Related operations:
 * - `drop` - same, but from the start of the array.
 * - `splice` - to remove or insert at an arbitrary index.
 * - `takeLast` - to keep the last `n` instead.
 *
 * @param n - The number of elements to drop, rounded up. If `n` is 0 or less (or `NaN`) no elements are dropped and a *clone* of the input is returned.
 * @signature
 *    dropLast(n)(array)
 * @example
 *    dropLast(2)([1, 2, 3, 4, 5]) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function dropLast(
  n: number,
): <T extends IterableContainer>(array: T) => Array<T[number]>;

export function dropLast(...args: ReadonlyArray<unknown>): unknown {
  // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
  return curryWithLazy(dropLastImplementation, args, lazyImplementation);
}

function dropLastImplementation<T extends IterableContainer>(array: T, n: number): Array<T[number]> {
  return n > 0
    ? array.slice(
        0,
        // Rounded up because we can't drop an item partially!
        -Math.ceil(n),
      )
    : [...array];
}

function lazyImplementation<T>(n: number): LazyEvaluator<T> {
  if (Number.isNaN(n) || n <= 0) {
    // Trivially dropping nothing...
    return (item) => item;
  }

  const heldBackCount = Math.ceil(n);
  const heldBack: Array<T> = [];
  return (item, index) => {
    if (index < heldBackCount) {
      heldBack.push(item);
      return SKIP_ITEM;
    }

    // A ring buffer of the latest items: the current item proves the oldest
    // one isn't among the last `n`, so it's passed on and its slot reused.
    const oldestPosition = index % heldBackCount;
    const oldest = heldBack[oldestPosition]!;
    heldBack[oldestPosition] = item;
    return oldest;
  };
}
