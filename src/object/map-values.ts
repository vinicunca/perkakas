import type { ObjectKeys } from '../utils/types';

import { purry } from '../function/purry';
import { toPairs } from './to-pairs';

/**
 * Maps values of `object` and keeps the same keys.
 * @param data the object to map
 * @param fn the mapping function
 * @signature
 *    P.mapValues(object, fn)
 * @example
 *    P.mapValues({a: 1, b: 2}, (value, key) => value + key) // => {a: '1a', b: '2b'}
 * @dataFirst
 * @category Object
 */
export function mapValues<T extends Record<PropertyKey, unknown>, S>(
  data: T,
  fn: (value: T[ObjectKeys<T>], key: ObjectKeys<T>) => S
): Record<ObjectKeys<T>, S>;

/**
 * Maps values of `object` and keeps the same keys.
 * @param fn the mapping function
 * @signature
 *    P.mapValues(fn)(object)
 * @example
 *    P.pipe({a: 1, b: 2}, P.mapValues((value, key) => value + key)) // => {a: '1a', b: '2b'}
 * @dataLast
 * @category Object
 */
export function mapValues<T extends Record<PropertyKey, unknown>, S>(
  fn: (value: T[keyof T], key: keyof T) => S
): (data: T) => Record<ObjectKeys<T>, S>;

export function mapValues(...args: Array<any>): unknown {
  return purry(mapValues_, args);
}

function mapValues_<T extends object>(
  data: T,
  fn: (value: Required<T>[keyof T], key: keyof T) => unknown,
) {
  const out: Partial<Record<keyof T, unknown>> = {};
  for (const [key, value] of toPairs.strict(data)) {
    out[key] = fn(value, key);
  }
  return out;
}
