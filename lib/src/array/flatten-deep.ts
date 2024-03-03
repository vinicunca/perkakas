import type { LazyResult } from '../utils/reduce-lazy';

import { purry } from '../function/purry';
import { reduceLazy } from '../utils/reduce-lazy';

type FlattenDeep<T> = T extends ReadonlyArray<infer K> ? FlattenDeep2<K> : T;
type FlattenDeep2<T> = T extends ReadonlyArray<infer K> ? FlattenDeep3<K> : T;
type FlattenDeep3<T> = T extends ReadonlyArray<infer K> ? FlattenDeep4<K> : T;
type FlattenDeep4<T> = T extends ReadonlyArray<infer K> ? K : T;

/**
 * Recursively flattens `array`.
 * Note: In `pipe`, use `flattenDeep()` form instead of `flattenDeep`. Otherwise, the inferred type is lost.
 * @param items the target array
 * @signature P.flattenDeep(array)
 * @example
 *    P.flattenDeep([[1, 2], [[3], [4, 5]]]) // => [1, 2, 3, 4, 5]
 *    P.pipe(
 *      [[1, 2], [[3], [4, 5]]],
 *      P.flattenDeep(),
 *    ); // => [1, 2, 3, 4, 5]
 * @category Array
 * @pipeable
 */
export function flattenDeep<T>(items: ReadonlyArray<T>): Array<FlattenDeep<T>>;

export function flattenDeep<T>(): (
  items: ReadonlyArray<T>
) => Array<FlattenDeep<T>>;

export function flattenDeep(...args: any[]) {
  return purry(_flattenDeep, args, flattenDeep.lazy);
}

function _flattenDeep<T>(items: Array<T>): Array<FlattenDeep<T>> {
  return reduceLazy(items, flattenDeep.lazy());
}

function _flattenDeepValue<T>(value: Array<T> | T): Array<FlattenDeep<T>> | T {
  if (!Array.isArray(value)) {
    return value;
  }
  const ret: Array<any> = [];
  value.forEach((item) => {
    if (Array.isArray(item)) {
      ret.push(...flattenDeep(item));
    } else {
      ret.push(item);
    }
  });
  return ret;
}

export namespace flattenDeep {
  export function lazy() {
    return (value: any): LazyResult<any> => {
      const next = _flattenDeepValue(value);
      if (Array.isArray(next)) {
        return {
          done: false,
          hasMany: true,
          hasNext: true,
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
