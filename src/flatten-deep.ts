import type { LazyEvaluator } from './pipe';

import { _reduceLazy } from './_reduce-lazy';
import { purry } from './purry';

type FlattenDeep<T> = T extends ReadonlyArray<infer K> ? FlattenDeep2<K> : T;
type FlattenDeep2<T> = T extends ReadonlyArray<infer K> ? FlattenDeep3<K> : T;
type FlattenDeep3<T> = T extends ReadonlyArray<infer K> ? FlattenDeep4<K> : T;
type FlattenDeep4<T> = T extends ReadonlyArray<infer K> ? K : T;

/**
 * Recursively flattens `array`.
 *
 * @param items the target array
 * @signature
 *  flattenDeep(array)
 * @example
 *  import { flattenDeep } from '@vinicunca/perkakas';
 *
 *  flattenDeep([[1, 2], [[3], [4, 5]]]) // => [1, 2, 3, 4, 5]
 * @pipeable
 * @category Array
 */
export function flattenDeep<T>(items: ReadonlyArray<T>): Array<FlattenDeep<T>>;

/**
 * Recursively flattens `array`.
 *
 * @signature
 *  flattenDeep()(array)
 * @example
 *  import { flattenDeep, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(
 *    [[1, 2], [[3], [4, 5]]],
 *    flattenDeep(),
 *  ); // => [1, 2, 3, 4, 5]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function flattenDeep<T>(): (
  items: ReadonlyArray<T>,
) => Array<FlattenDeep<T>>;

export function flattenDeep(...args: Array<any>): unknown {
  return purry(flattenDeep_, args, flattenDeep.lazy);
}

function flattenDeep_<T>(items: ReadonlyArray<T>): Array<FlattenDeep<T>> {
  return _reduceLazy(items, flattenDeep.lazy());
}

function flattenDeepValue_<T>(value: Array<T> | T): Array<FlattenDeep<T>> | T {
  if (!Array.isArray(value)) {
    return value;
  }
  const ret: Array<any> = [];

  for (const item of value) {
    if (Array.isArray(item)) {
      ret.push(...flattenDeep(item));
    } else {
      ret.push(item);
    }
  }

  return ret;
}

export namespace flattenDeep {
  export function lazy<T>(): LazyEvaluator<T, any> {
    return (value) => {
      const next = flattenDeepValue_(value);
      return Array.isArray(next)
        ? { done: false, hasMany: true, hasNext: true, next }
        : { done: false, hasNext: true, next };
    };
  }
}
