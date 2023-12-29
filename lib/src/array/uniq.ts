import type { LazyResult } from '../utils/reduce-lazy';

import { purry } from '../function';
import { _reduceLazy } from '../utils/reduce-lazy';

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by reference using Set.
 * Note: In `pipe`, use `uniq()` form instead of `uniq`. Otherwise, the inferred type is lost.
 * @param array
 * @signature
 *    P.uniq(array)
 * @example
 *    P.uniq([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 *    P.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      P.uniq(),
 *      P.take(3)
 *    ) // => [1, 2, 5]
 * @pipeable
 * @category Array
 */

export function uniq<T>(array: ReadonlyArray<T>): Array<T>;
export function uniq<T>(): (array: ReadonlyArray<T>) => Array<T>;

export function uniq(...args: any[]) {
  return purry(_uniq, args, uniq.lazy);
}

function _uniq<T>(array: Array<T>) {
  return _reduceLazy(array, uniq.lazy());
}

export namespace uniq {
  export function lazy() {
    const set = new Set<any>();
    return (value: any): LazyResult<any> => {
      if (set.has(value)) {
        return {
          done: false,
          hasNext: false,
        };
      }
      set.add(value);
      return {
        done: false,
        hasNext: true,
        next: value,
      };
    };
  }
}
