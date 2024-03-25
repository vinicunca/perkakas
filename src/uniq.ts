import type { LazyEvaluator } from '../pipe';

import { purry } from '../purry';
import { reduceLazy } from '../utils/reduce-lazy';

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by reference using Set.
 * @param array
 * @signature
 *    uniq(array)
 * @example
 *    uniq([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @pipeable
 * @category Array
 * @dataFirst
 */
export function uniq<T>(array: ReadonlyArray<T>): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by reference using Set.
 * @param array
 * @signature
 *    uniq()(array)
 * @example
 *    pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      uniq(),
 *      take(3)
 *    ) // => [1, 2, 5]
 * @pipeable
 * @category Array
 * @dataLast
 */
export function uniq<T>(): (array: ReadonlyArray<T>) => Array<T>;

export function uniq(...args: Array<any>): unknown {
  return purry(uniq_, args, uniq.lazy);
}

function uniq_<T>(array: ReadonlyArray<T>): Array<T> {
  return reduceLazy(array, uniq.lazy());
}

export namespace uniq {
  export function lazy<T>(): LazyEvaluator<T> {
    const set = new Set<T>();
    return (value) => {
      if (set.has(value)) {
        return { done: false, hasNext: false };
      }
      set.add(value);
      return { done: false, hasNext: true, next: value };
    };
  }
}
