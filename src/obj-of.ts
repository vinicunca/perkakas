import { curry } from './curry';

/**
 * Creates an object containing a single `key:value` pair.
 *
 * @param value - The object value.
 * @param key - The property name.
 * @signature
 *    objOf(value, key)
 * @example
 *    objOf(10, 'a') // => { a: 10 }
 * @category Object
 */
export function objOf<T, K extends string>(value: T, key: K): Record<K, T>;

/**
 * Creates an object containing a single `key:value` pair.
 *
 * @param key - The property name.
 * @signature
 *    objOf(key)(value)
 * @example
 *    pipe(10, objOf('a')) // => { a: 10 }
 * @category Object
 */
export function objOf<T, K extends string>(key: K): (value: T) => Record<K, T>;

export function objOf(...args: ReadonlyArray<unknown>): unknown {
  return curry(objOfImplementation, args);
}

function objOfImplementation<T, K extends string>(value: T, key: K): Record<K, T> {
  return { [key]: value };
}
