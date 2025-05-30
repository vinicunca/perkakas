import type { BoundedPartial } from './internal/types/bounded-partial';
import { curry } from './curry';

/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * `fromEntries` - Builds an object from an array of key-value pairs.
 * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - The array.
 * @param mapper - The indexing function.
 * @signature
 *    P.indexBy(array, fn)
 * @example
 *    P.indexBy(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @dataFirst
 * @category Array
 */
export function indexBy<T, K extends PropertyKey>(
  data: ReadonlyArray<T>,
  mapper: (item: T, index: number, data: ReadonlyArray<T>) => K,
): BoundedPartial<Record<K, T>>;

/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * `fromEntries` - Builds an object from an array of key-value pairs.
 * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param mapper - The indexing function.
 * @signature
 *    P.indexBy(fn)(array)
 * @example
 *    P.pipe(
 *      ['one', 'two', 'three'],
 *      P.indexBy(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @dataLast
 * @category Array
 */
export function indexBy<T, K extends PropertyKey>(
  mapper: (item: T, index: number, data: ReadonlyArray<T>) => K,
): (data: ReadonlyArray<T>) => BoundedPartial<Record<K, T>>;

export function indexBy(...args: ReadonlyArray<unknown>): unknown {
  return curry(indexByImplementation, args);
}

function indexByImplementation<T, K extends PropertyKey>(
  data: ReadonlyArray<T>,
  mapper: (item: T, index: number, data: ReadonlyArray<T>) => K,
): BoundedPartial<Record<K, T>> {
  const out: Partial<Record<K, T>> = {};

  for (const [index, item] of data.entries()) {
    const key = mapper(item, index, data);
    out[key] = item;
  }

  return out as BoundedPartial<Record<K, T>>;
}
