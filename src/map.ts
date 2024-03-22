import type {
  IterableContainer,
  Pred,
  PredIndexed,
  PredIndexedOptional,
} from './_types';
import type { LazyEvaluator } from './pipe';

import { reduceLazy } from './_reduce-lazy';
import { toLazyIndexed } from './_to-lazy-indexed';
import { purry } from './purry';

/**
 * Map each element of an array using a defined callback function. If the input
 * array is a tuple use the `strict` variant to maintain it's shape.
 * @param array The array to map.
 * @param fn The function mapper.
 * @returns The new mapped array.
 * @signature
 *    P.map(array, fn)
 *    P.map.indexed(array, fn)
 *    P.map.strict(array, fn)
 *    P.map.strict.indexed(array, fn)
 * @example
 *    P.map([1, 2, 3], x => x * 2) // => [2, 4, 6], typed number[]
 *    P.map.indexed([0, 0, 0], (x, i) => i) // => [0, 1, 2], typed number[]
 *    P.map.strict([0, 0] as const, x => x + 1) // => [1, 1], typed [number, number]
 *    P.map.strict.indexed([0, 0] as const, (x, i) => x + i) // => [0, 1], typed [number, number]
 * @dataFirst
 * @indexed
 * @pipeable
 * @strict
 * @category Array
 */
export function map<T, K>(array: ReadonlyArray<T>, fn: Pred<T, K>): Array<K>;

/**
 * Map each value of an object using a defined callback function.
 * @param fn the function mapper
 * @signature
 *    P.map(fn)(array)
 *    P.map.indexed(fn)(array)
 * @example
 *    P.pipe([0, 1, 2], P.map(x => x * 2)) // => [0, 2, 4]
 *    P.pipe([0, 0, 0], P.map.indexed((x, i) => i)) // => [0, 1, 2]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function map<T, K>(
  fn: Pred<T, K>
): (array: ReadonlyArray<T>) => Array<K>;

export function map(...args: Array<any>): unknown {
  return purry(map_(false), args, map.lazy);
}

function map_(indexed: boolean) {
  return <T, K>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, K>) => {
    return reduceLazy(
      array,
      indexed ? map.lazyIndexed(fn) : map.lazy(fn),
      indexed,
    );
  };
}

function lazy_(indexed: boolean) {
  return <T, K>(fn: PredIndexedOptional<T, K>): LazyEvaluator<T, K> =>
    (value, index, array) => ({
      done: false,
      hasNext: true,
      next: indexed ? fn(value, index, array) : fn(value),
    });
}

// Redefining the map API with a stricter return type. This API is accessed via
// `map.strict`
interface Strict {
  <T extends IterableContainer, K>(
    items: T,
    mapper: Pred<T[number], K>,
  ): StrictOut<T, K>;

  <T extends IterableContainer, K>(
    mapper: Pred<T[number], K>,
  ): (items: T) => StrictOut<T, K>;

  readonly indexed: {
    <T extends IterableContainer, K>(
      items: T,
      mapper: PredIndexed<T[number], K>,
    ): StrictOut<T, K>;

    <T extends IterableContainer, K>(
      mapper: PredIndexed<T[number], K>,
    ): (items: T) => StrictOut<T, K>;
  };
}

type StrictOut<T extends IterableContainer, K> = {
  -readonly [P in keyof T]: K;
};

export namespace map {
  export function indexed<T, K>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, K>,
  ): Array<K>;
  export function indexed<T, K>(
    fn: PredIndexed<T, K>,
  ): (array: ReadonlyArray<T>) => Array<K>;
  export function indexed(...args: Array<any>): unknown {
    return purry(map_(true), args, map.lazyIndexed);
  }

  export const lazy = lazy_(false);
  export const lazyIndexed = toLazyIndexed(lazy_(true));

  export const strict: Strict = map;
}
