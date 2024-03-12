import type { LazyEvaluator } from '../function/pipe';

import { purry } from '../function/purry';
import { reduceLazy } from '../utils/reduce-lazy';

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

/**
 * Flattens `array` a single level deep.
 *
 * @param items the target array
 * @signature
 *   P.flatten()(array)
 * @example
 *    P.pipe(
 *      [[1, 2], [3], [4, 5]],
 *      P.flatten(),
 *    ); // => [1, 2, 3, 4, 5]
 * @category Array
 * @pipeable
 * @dataLast
 */
export function flatten<T>(): (items: ReadonlyArray<T>) => Array<Flatten<T>>;

export function flatten(...args: any[]): unknown {
  return purry(flatten_, args, flatten.lazy);
}

function flatten_<T>(items: ReadonlyArray<T>): Array<Flatten<T>> {
  return reduceLazy(items, flatten.lazy());
}

export namespace flatten {
  export function lazy<T>(): LazyEvaluator<T, Flatten<T>> {
    return (item) =>
      // @ts-expect-error [ts2322] - We need to make LazyMany better so it accommodate the typing here...
      Array.isArray(item)
        ? { done: false, hasMany: true, hasNext: true, next: item }
        : { done: false, hasNext: true, next: item };
  }
}