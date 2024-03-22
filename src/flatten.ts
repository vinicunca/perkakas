import type { LazyEvaluator } from './pipe';

import { reduceLazy } from './_reduce-lazy';
import { purry } from './purry';

type Flatten<T> = T extends ReadonlyArray<infer K> ? K : T;

/**
 * Flattens `array` a single level deep.
 *
 * @param items the target array
 * @signature
 *    P.flatten(array)
 * @example
 *    P.flatten([[1, 2], [3], [4, 5]]) // => [1, 2, 3, 4, 5]
 *    P.pipe(
 *      [[1, 2], [3], [4, 5]],
 *      P.flatten(),
 *    ); // => [1, 2, 3, 4, 5]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function flatten<T>(items: ReadonlyArray<T>): Array<Flatten<T>>;

/**
 * Flattens `array` a single level deep.
 *
 * @signature
 *   P.flatten()(array)
 * @example
 *    P.pipe(
 *      [[1, 2], [3], [4, 5]],
 *      P.flatten(),
 *    ); // => [1, 2, 3, 4, 5]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function flatten<T>(): (items: ReadonlyArray<T>) => Array<Flatten<T>>;

export function flatten(...args: Array<any>): unknown {
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
