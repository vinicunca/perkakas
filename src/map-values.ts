import type { Simplify } from 'type-fest';

import type {
  EnumerableStringKeyOf,
  EnumerableStringKeyedValueOf,
} from './helpers/types';

import { curry } from './curry';

type MappedValues<T extends object, Value> = Simplify<{
  -readonly [P in keyof T as `${P extends number | string ? P : never}`]: Value;
}>;

/**
 * Maps values of `object` and keeps the same keys. Symbol keys are not passed
 * to the mapper and will be removed from the output object.
 *
 * To also copy the symbol keys to the output use merge:
 * `merge(data, mapValues(data, mapper))`).
 *
 * @param data - The object to map.
 * @param valueMapper - The mapping function.
 * @signature
 *    P.mapValues(data, mapper)
 * @example
 *    P.mapValues({a: 1, b: 2}, (value, key) => value + key) // => {a: '1a', b: '2b'}
 * @dataFirst
 * @category Object
 */
export function mapValues<T extends object, Value>(
  data: T,
  valueMapper: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => Value,
): MappedValues<T, Value>;

/**
 * Maps values of `object` and keeps the same keys. Symbol keys are not passed
 * to the mapper and will be removed from the output object.
 *
 * To also copy the symbol keys to the output use merge:
 * `merge(data, mapValues(data, mapper))`).
 *
 * @param valueMapper - The mapping function.
 * @signature
 *    P.mapValues(mapper)(data)
 * @example
 *    P.pipe({a: 1, b: 2}, P.mapValues((value, key) => value + key)) // => {a: '1a', b: '2b'}
 * @dataLast
 * @category Object
 */
export function mapValues<T extends object, Value>(
  valueMapper: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => Value,
): (data: T) => MappedValues<T, Value>;

export function mapValues(...args: ReadonlyArray<unknown>): unknown {
  return curry(mapValuesImplementation, args);
}

function mapValuesImplementation<T extends Record<string, unknown>, S>(
  data: T,
  valueMapper: (value: unknown, key: string, data: T) => S,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const mappedValue = valueMapper(value, key, data);
    out[key] = mappedValue;
  }

  return out;
}
