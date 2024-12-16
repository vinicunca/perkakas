import { curry } from './curry';

/**
 * Gets the value of the given property.
 *
 * @param data - The object to extract the prop from.
 * @param key - The key of the property to extract.
 * @signature
 *   P.prop(data, key);
 * @example
 *   P.prop({ foo: 'bar' }, 'foo'); // => 'bar'
 * @dataFirst
 * @category Object
 */
export function prop<T, K extends keyof T>(data: T, key: K): T[K];

/**
 * Gets the value of the given property.
 *
 * @param key - The key of the property to extract.
 * @signature
 *   P.prop(key)(data);
 * @example
 *    P.pipe({foo: 'bar'}, P.prop('foo')) // => 'bar'
 * @dataLast
 * @category Object
 */
export function prop<T, K extends keyof T>(key: K): (data: T) => T[K];

export function prop<K extends PropertyKey>(
  key: K,
): <T extends Partial<Record<K, unknown>>>(data: T) => T[K];

export function prop(...args: ReadonlyArray<unknown>): unknown {
  return curry(propImplementation, args);
}

export function propImplementation<T, K extends keyof T>(
  data: T,
  key: K,
): T[K] {
  return data[key];
}
