import { type LazyResult } from '../utils/reduce-lazy';
import { _reduceLazy } from '../utils/reduce-lazy';
import { purry } from '../function';

type Flatten<T> = T extends ReadonlyArray<infer K> ? K : T;

/**
 * Flattens `array` a single level deep.
 * Note: In `pipe`, use `flatten()` form instead of `flatten`. Otherwise, the inferred type is lost.

 * @param items the target array
 * @signature P.flatten(array)
 * @example
 *    P.flatten([[1, 2], [3], [4, 5]]) // => [1, 2, 3, 4, 5]
 *    P.pipe(
 *      [[1, 2], [3], [4, 5]],
 *      P.flatten(),
 *    ); // => [1, 2, 3, 4, 5]
 * @category Array
 * @pipeable
 */
export function flatten<T>(items: ReadonlyArray<T>): Array<Flatten<T>>;

export function flatten<T>(): (items: ReadonlyArray<T>) => Array<Flatten<T>>;

export function flatten() {
  return purry(_flatten, arguments, flatten.lazy);
}

function _flatten<T>(items: Array<T>): Array<Flatten<T>> {
  return _reduceLazy(items, flatten.lazy());
}

export namespace flatten {
  export function lazy<T>() {
    return (next: T): LazyResult<any> => {
      if (Array.isArray(next)) {
        return {
          done: false,
          hasNext: true,
          hasMany: true,
          next,
        };
      }
      return {
        done: false,
        hasNext: true,
        next,
      };
    };
  }
}
