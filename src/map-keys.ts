/* eslint-disable ts/no-empty-object-type --
 * We want to match the typing of the built-in Object.entries as much as
 * possible!
 */

import type { BoundedPartial } from './internal/types/bounded-partial';
import type { EnumerableStringKeyOf } from './internal/types/enumerable-string-key-of';

import type { EnumerableStringKeyedValueOf } from './internal/types/enumerable-string-keyed-value-of';
import { curry } from './curry';

/**
 * Maps keys of `object` and keeps the same values.
 *
 * @param data - The object to map.
 * @param keyMapper - The mapping function.
 * @signature
 *    P.mapKeys(object, fn)
 * @example
 *    P.mapKeys({a: 1, b: 2}, (key, value) => key + value) // => { a1: 1, b2: 2 }
 * @dataFirst
 * @category Object
 */
export function mapKeys<T extends {}, S extends PropertyKey>(
  data: T,
  keyMapper: (
    key: EnumerableStringKeyOf<T>,
    value: EnumerableStringKeyedValueOf<T>,
    data: T,
  ) => S,
): BoundedPartial<Record<S, EnumerableStringKeyedValueOf<T>>>;

/**
 * Maps keys of `object` and keeps the same values.
 *
 * @param keyMapper - The mapping function.
 * @signature
 *    P.mapKeys(fn)(object)
 * @example
 *    P.pipe({a: 1, b: 2}, P.mapKeys((key, value) => key + value)) // => { a1: 1, b2: 2 }
 * @dataLast
 * @category Object
 */
export function mapKeys<T extends {}, S extends PropertyKey>(
  keyMapper: (
    key: EnumerableStringKeyOf<T>,
    value: EnumerableStringKeyedValueOf<T>,
    data: T,
  ) => S,
): (data: T) => BoundedPartial<Record<S, EnumerableStringKeyedValueOf<T>>>;

export function mapKeys(...args: ReadonlyArray<unknown>): unknown {
  return curry(mapKeysImplementation, args);
}

function mapKeysImplementation<T extends {}, S extends PropertyKey>(
  data: T,
  keyMapper: (key: string, value: unknown, data: T) => S,
): Partial<Record<S, unknown>> {
  const out: Partial<Record<S, unknown>> = {};

  for (const [key, value] of Object.entries(data)) {
    const mappedKey = keyMapper(key, value, data);
    out[mappedKey] = value;
  }

  return out;
}
