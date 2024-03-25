import { entries } from './entries';
import { purry } from './purry';

/**
 * Maps keys of `object` and keeps the same values.
 * @param data the object to map
 * @param fn the mapping function
 * @signature
 *  mapKeys(object, fn)
 * @example
 *  import { mapKeys } from '@vinicunca/perkakas';
 *
 *  mapKeys({a: 1, b: 2}, (key, value) => key + value) // => { a1: 1, b2: 2 }
 * @dataFirst
 * @category Object
 */
export function mapKeys<T, S extends PropertyKey>(
  data: T,
  fn: (key: keyof T, value: Required<T>[keyof T]) => S
): Record<S, T[keyof T]>;

/**
 * Maps keys of `object` and keeps the same values.
 * @param fn the mapping function
 * @signature
 *  mapKeys(fn)(object)
 * @example
 *  import { mapKeys, pipe } from '@vinicunca/perkakas';
 *
 *  pipe({a: 1, b: 2}, mapKeys((key, value) => key + value)) // => { a1: 1, b2: 2 }
 * @dataLast
 * @category Object
 */
export function mapKeys<T, S extends PropertyKey>(
  fn: (key: keyof T, value: Required<T>[keyof T]) => S
): (data: T) => Record<S, T[keyof T]>;

export function mapKeys(...args: Array<any>): unknown {
  return purry(mapKeys_, args);
}

function mapKeys_<T extends object, S extends PropertyKey>(
  data: T,
  fn: (key: keyof T, value: Required<T>[keyof T]) => S,
) {
  const out: Partial<Record<S, T[keyof T]>> = {};
  for (const [key, value] of entries.strict(data)) {
    out[fn(key, value)] = value;
  }

  return out;
}
