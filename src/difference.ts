import type { LazyEvaluator } from './internal/types/lazy-evaluator';

import { curryFromLazy } from './internal/curry-from-lazy';
import { lazyIdentityEvaluator, SKIP_ITEM } from './internal/utility-evaluators';

/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param data - The input items.
 * @param other - The values to exclude.
 * @signature
 *    P.difference(data, other)
 * @example
 *    P.difference([1, 2, 3, 4], [2, 5, 3]); // => [1, 4]
 *    P.difference([1, 1, 2, 2], [1]); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function difference<T>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T>;

/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param other - The values to exclude.
 * @signature
 *    P.difference(other)(data)
 * @example
 *    P.pipe([1, 2, 3, 4], P.difference([2, 5, 3])); // => [1, 4]
 *    P.pipe([1, 1, 2, 2], P.difference([1])); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function difference<T>(
  other: ReadonlyArray<T>,
): (data: ReadonlyArray<T>) => Array<T>;

export function difference(...args: ReadonlyArray<unknown>): unknown {
  return curryFromLazy(lazyImplementation, args);
}

function lazyImplementation<T>(other: ReadonlyArray<T>): LazyEvaluator<T> {
  if (other.length === 0) {
    return lazyIdentityEvaluator;
  }

  // We need to build a more efficient data structure that would allow us to
  // keep track of the number of times we've seen a value in the other array.
  const remaining = new Map<T, number>();
  for (const value of other) {
    remaining.set(value, (remaining.get(value) ?? 0) + 1);
  }

  return (value) => {
    const copies = remaining.get(value);

    if (copies === undefined || copies === 0) {
      // The item is either not part of the other array or we've dropped enough
      // copies of it so we return it.
      return { done: false, hasNext: true, next: value };
    }

    // The item is equal to an item in the other array and there are still
    // copies of it to "account" for so we skip this one and remove it from our
    // ongoing tally.
    remaining.set(value, copies - 1);
    return SKIP_ITEM;
  };
}
