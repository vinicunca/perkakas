import type { LazyEvaluator } from './pipe';

import { _reduceLazy } from './_reduce-lazy';
import { purry } from './purry';

type Flatten<T> = T extends ReadonlyArray<infer K> ? K : T;

/**
 * Flattens `array` a single level deep.
 *
 * @param items the target array
 * @signature
 *  flatten(array)
 * @example
 *  import { flatten } from '@vinicunca/perkakas';
 *
 *  flatten([[1, 2], [3], [4, 5]]); // => [1, 2, 3, 4, 5]
 *  pipe(
 *    [[1, 2], [3], [4, 5]],
 *    flatten(),
 *  ); // => [1, 2, 3, 4, 5]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function flatten<T>(items: ReadonlyArray<T>): Array<Flatten<T>>;

/**
 * Flattens `array` a single level deep.
 *
 * @signature
 *  flatten()(array)
 * @example
 *  import { flatten, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(
 *    [[1, 2], [3], [4, 5]],
 *    flatten(),
 *  ); // => [1, 2, 3, 4, 5]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function flatten<T>(): (items: ReadonlyArray<T>) => Array<Flatten<T>>;

export function flatten(...args: Array<any>): unknown {
  return purry(flatten_, args, flatten.lazy);
}

function flatten_<T>(items: ReadonlyArray<T>): Array<Flatten<T>> {
  return _reduceLazy(items, flatten.lazy());
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
