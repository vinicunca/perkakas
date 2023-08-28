import { type PredIndexed, type PredIndexedOptional } from '../utils/types';
import { purry } from '../function/purry';

/**
 * Converts a list of objects into an object indexing the objects by the given key.
 * @param array the array
 * @param fn the indexing function
 * @signature
 *    P.indexBy(array, fn)
 * @example
 *    P.indexBy(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @data_first
 * @indexed
 * @category Array
 */
export function indexBy<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => any
): Record<string, T>;

/**
 * Converts a list of objects into an object indexing the objects by the given key.
 * @param array the array
 * @param fn the indexing function
 * @signature
 *    P.indexBy(fn)(array)
 * @example
 *    P.pipe(
 *      ['one', 'two', 'three'],
 *      P.indexBy(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @data_last
 * @indexed
 * @category Array
 */
export function indexBy<T>(
  fn: (item: T) => any
): (array: ReadonlyArray<T>) => Record<string, T>;

export function indexBy() {
  return purry(_indexBy(false), arguments);
}

function _indexBy(indexed: boolean) {
  return <T>(array: Array<T>, fn: PredIndexedOptional<T, any>) => {
    return array.reduce<Record<string, T>>((ret, item, index) => {
      const value = indexed ? fn(item, index, array) : fn(item);
      const key = String(value);
      ret[key] = item;
      return ret;
    }, {});
  };
}

export namespace indexBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, any>
  ): Record<string, T>;
  export function indexed<T>(
    fn: PredIndexed<T, any>
  ): (array: ReadonlyArray<T>) => Record<string, T>;
  export function indexed() {
    return purry(_indexBy(true), arguments);
  }
}