import type { PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';

/**
 * Converts a list of objects into an object indexing the objects by the given key (casted to a string).
 * Use the strict version to maintain the given key's type, so long as it is a valid `PropertyKey`.
 *
 * @param array the array
 * @param fn the indexing function
 * @signature
 *    P.indexBy(array, fn)
 *    P.indexBy.strict(array, fn)
 * @example
 *    P.indexBy(['one', 'two', 'three'], x => x.length) // => {"3": 'two', "5": 'three'}
 *    P.indexBy.strict(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @dataFirst
 * @indexed
 * @category Array
 * @strict
 */
export function indexBy<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => unknown,
): Record<string, T>;

/**
 * Converts a list of objects into an object indexing the objects by the given key.
 * (casted to a string). Use the strict version to maintain the given key's type, so
 * long as it is a valid `PropertyKey`.
 *
 * @param array the array
 * @param fn the indexing function
 * @signature
 *    P.indexBy(fn)(array)
 *    P.indexBy.strict(fn)(array)
 * @example
 *    P.pipe(
 *      ['one', 'two', 'three'],
 *      P.indexBy(x => x.length)
 *    ) // => {"3": 'two', "5": 'three'}
 *    P.pipe(
 *      ['one', 'two', 'three'],
 *      P.indexBy.strict(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @dataLast
 * @indexed
 * @category Array
 * @strict
 */
export function indexBy<T>(
  fn: (item: T) => unknown,
): (array: ReadonlyArray<T>) => Record<string, T>;

export function indexBy(...args: any[]): unknown {
  return purry(indexBy_(false), args);
}

function indexBy_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, unknown>) => {
    const out: Record<string, T> = {};
    for (const [index, item] of array.entries()) {
      const value = indexed ? fn(item, index, array) : fn(item);
      const key = String(value);
      out[key] = item;
    }
    return out;
  };
}

function indexByStrict<K extends PropertyKey, T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => K,
): Partial<Record<K, T>>;

function indexByStrict<K extends PropertyKey, T>(
  fn: (item: T) => K,
): (array: ReadonlyArray<T>) => Partial<Record<K, T>>;

function indexByStrict(...args: any[]): unknown {
  return purry(indexByStrict_, args);
}

function indexByStrict_<K extends PropertyKey, T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => K,
): Partial<Record<K, T>> {
  const out: Partial<Record<K, T>> = {};

  for (const item of array) {
    const key = fn(item);
    out[key] = item;
  }

  return out;
}

export namespace indexBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, unknown>,
  ): Record<string, T>;
  export function indexed<T>(
    fn: PredIndexed<T, unknown>,
  ): (array: ReadonlyArray<T>) => Record<string, T>;
  export function indexed(...args: any[]): unknown {
    return purry(indexBy_(true), args);
  }
  export const strict = indexByStrict;
}
