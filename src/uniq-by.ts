import type { LazyEvaluator } from '../pipe';

import { purry } from '../purry';
import { reduceLazy } from '../utils/reduce-lazy';

export function uniqBy<T, K>(
  array: ReadonlyArray<T>,
  transformer: (item: T) => K
): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original list transformed by a function.
 * Elements are compared by reference using Set.
 * @param array
 * @signature
 *    uniqBy(array, fn)
 * @example
 *    uniqBy(
 *     [{ n: 1 }, { n: 2 }, { n: 2 }, { n: 5 }, { n: 1 }, { n: 6 }, { n: 7 }],
 *     (obj) => obj.n,
 *    ) // => [{n: 1}, {n: 2}, {n: 5}, {n: 6}, {n: 7}]
 *    pipe(
 *      [{n: 1}, {n: 2}, {n: 2}, {n: 5}, {n: 1}, {n: 6}, {n: 7}], // only 4 iterations
 *      uniqBy(obj => obj.n),
 *      take(3)
 *    ) // => [{n: 1}, {n: 2}, {n: 5}]
 * @pipeable
 * @category Array
 */

export function uniqBy<T, K>(
  transformer: (item: T) => K
): (array: ReadonlyArray<T>) => Array<T>;

export function uniqBy(...args: Array<any>): unknown {
  return purry(uniqBy_, args, lazyUniqBy);
}

function uniqBy_<T, K>(
  array: ReadonlyArray<T>,
  transformer: (item: T) => K,
): Array<T> {
  return reduceLazy(array, lazyUniqBy(transformer));
}

function lazyUniqBy<T, K>(transformer: (item: T) => K): LazyEvaluator<T> {
  const set = new Set<K>();
  return (value) => {
    const appliedItem = transformer(value);
    if (set.has(appliedItem)) {
      return { done: false, hasNext: false };
    }

    set.add(appliedItem);
    return { done: false, hasNext: true, next: value };
  };
}
