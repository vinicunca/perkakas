import type { LazyEvaluator } from './pipe';

import { _reduceLazy } from './_reduce-lazy';
import { purry } from './purry';

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @param array - The array to filter.
 * @signature
 *  unique(array)
 * @example
 *  import { unique } from '@vinicunca/perkakas';
 *
 *  unique([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function unique<T>(array: ReadonlyArray<T>): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @signature
 *  unique()(array)
 * @example
 *  import { unique, pipe, take } from '@vinicunca/perkakas';
 *
 *  pipe(
 *    [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *    unique(),
 *    take(3)
 *  ) // => [1, 2, 5]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function unique<T>(): (array: ReadonlyArray<T>) => Array<T>;

export function unique(...args: Array<any>): unknown {
  return purry(uniqueImplementation, args, unique.lazy);
}

function uniqueImplementation<T>(array: ReadonlyArray<T>): Array<T> {
  return _reduceLazy(array, unique.lazy());
}

export namespace unique {
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
