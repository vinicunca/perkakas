import type { Deduped } from './internal/types/deduped';
import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';

import { curryFromLazy } from './internal/curry-from-lazy';
import { SKIP_ITEM } from './internal/utility-evaluators';

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @param keyFunction - Extracts a value that would be used to compare elements.
 * @signature
 *    P.uniqueBy(data, keyFunction)
 * @example
 *    P.uniqueBy(
 *     [{ n: 1 }, { n: 2 }, { n: 2 }, { n: 5 }, { n: 1 }, { n: 6 }, { n: 7 }],
 *     (obj) => obj.n,
 *    ) // => [{n: 1}, {n: 2}, {n: 5}, {n: 6}, {n: 7}]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function uniqueBy<T extends IterableContainer, K>(
  data: T,
  keyFunction: (item: T[number], index: number, data: T) => K,
): Deduped<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param keyFunction - Extracts a value that would be used to compare elements.
 * @signature
 *    P.uniqueBy(keyFunction)(data)
 * @example
 *    P.pipe(
 *      [{n: 1}, {n: 2}, {n: 2}, {n: 5}, {n: 1}, {n: 6}, {n: 7}], // only 4 iterations
 *      P.uniqueBy(obj => obj.n),
 *      P.take(3)
 *    ) // => [{n: 1}, {n: 2}, {n: 5}]
 * @dataLast
 * @lazy
 * @category Array
 */
export function uniqueBy<T extends IterableContainer, K>(
  keyFunction: (item: T[number], index: number, data: T) => K,
): (data: T) => Deduped<T>;

export function uniqueBy(...args: ReadonlyArray<unknown>): unknown {
  return curryFromLazy(lazyImplementation, args);
}

function lazyImplementation<T, K>(
  keyFunction: (item: T, index: number, data: ReadonlyArray<T>) => K,
): LazyEvaluator<T> {
  const set = new Set<K>();
  return (value, index, data) => {
    const key = keyFunction(value, index, data);
    if (set.has(key)) {
      return SKIP_ITEM;
    }

    set.add(key);
    return { done: false, hasNext: true, next: value };
  };
}
