import type { Deduped, IterableContainer } from './helpers/types';
import type { LazyEvaluator } from './pipe';

import { curryFromLazy } from './helpers/curry-from-lazy';
import { SKIP_ITEM } from './helpers/utility-evaluators';

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @signature
 *    P.unique(array)
 * @example
 *    P.unique([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function unique<T extends IterableContainer>(data: T): Deduped<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @signature
 *    P.unique()(array)
 * @example
 *    P.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      P.unique(),
 *      P.take(3)
 *    ) // => [1, 2, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
export function unique(): <T extends IterableContainer>(data: T) => Deduped<T>;

export function unique(...args: ReadonlyArray<unknown>): unknown {
  return curryFromLazy(lazyImplementation, args);
}

function lazyImplementation<T>(): LazyEvaluator<T> {
  const set = new Set<T>();
  return (value) => {
    if (set.has(value)) {
      return SKIP_ITEM;
    }
    set.add(value);
    return { done: false, hasNext: true, next: value };
  };
}
