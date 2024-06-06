import type { IterableContainer } from './helpers/types';

import { curry } from './curry';

/**
 * Creates an object that maps the result of `valueExtractor` with a key
 * resulting from running `keyExtractor` on each item in `data`. Duplicate keys
 * are overwritten, guaranteeing that the extractor functions are run on each
 * item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * `fromEntries` - Builds an object from an array of key-value pairs.
 * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - The items used to pull/extract the keys and values from.
 * @param keyExtractor - Computes the key for item.
 * @param valueExtractor - Computes the value for the item.
 * @signature
 *   P.pullObject(data, keyExtractor, valueExtractor);
 * @example
 *   P.pullObject(
 *     [
 *       { name: "john", email: "john@bebedag.com" },
 *       { name: "jane", email: "jane@bebedag.com" }
 *     ],
 *     P.prop("name"),
 *     P.prop("email"),
 *   ); // => { john: "john@bebedag.com", jane: "jane@bebedag.com" }
 * @dataFirst
 * @category Object
 */
export function pullObject<
  T extends IterableContainer,
  K extends PropertyKey,
  V,
>(
  data: T,
  keyExtractor: (item: T[number], index: number, data: T) => K,
  valueExtractor: (item: T[number], index: number, data: T) => V,
): Partial<Record<K, V>>;

/**
 * Creates an object that maps the result of `valueExtractor` with a key
 * resulting from running `keyExtractor` on each item in `data`. Duplicate keys
 * are overwritten, guaranteeing that the extractor functions are run on each
 * item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * `fromEntries` - Builds an object from an array of key-value pairs.
 * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param keyExtractor - Computes the key for item.
 * @param valueExtractor - Computes the value for the item.
 * @signature
 *   P.pullObject(keyExtractor, valueExtractor)(data);
 * @example
 *   P.pipe(
 *     [
 *       { name: "john", email: "john@bebedag.com" },
 *       { name: "jane", email: "jane@bebedag.com" }
 *     ],
 *     P.pullObject(P.prop("email"), P.prop("name")),
 *   ); // => { john: "john@bebedag.com", jane: "jane@bebedag.com" }
 * @dataLast
 * @category Object
 */
export function pullObject<
  T extends IterableContainer,
  K extends PropertyKey,
  V,
>(
  keyExtractor: (item: T[number], index: number, data: T) => K,
  valueExtractor: (item: T[number], index: number, data: T) => V,
): (data: T) => Partial<Record<K, V>>;

export function pullObject(...args: ReadonlyArray<unknown>): unknown {
  return curry(pullObjectImplementation, args);
}

function pullObjectImplementation<
  T extends IterableContainer,
  K extends PropertyKey,
  V,
>(
  data: T,
  keyExtractor: (item: T[number], index: number, data: T) => K,
  valueExtractor: (item: T[number], index: number, data: T) => V,
): Partial<Record<K, V>> {
  const result: Partial<Record<K, V>> = {};

  for (const [index, item] of data.entries()) {
    const key = keyExtractor(item, index, data);
    const value = valueExtractor(item, index, data);
    result[key] = value;
  }

  return result;
}
