import { curry } from './curry';

/**
 * Creates an object containing a single `key:value` pair.
 *
 * @param value - The object value.
 * @param key - The property name.
 * @signature
 *    P.objOf(value, key)
 * @example
 *    P.objOf(10, 'a') // => { a: 10 }
 * @category Object
 */
export function objOf<T, K extends string>(value: T, key: K): { [x in K]: T };

/**
 * Creates an object containing a single `key:value` pair.
 *
 * @param key - The property name.
 * @signature
 *    P.objOf(key)(value)
 * @example
 *    P.pipe(10, P.objOf('a')) // => { a: 10 }
 * @category Object
 */
export function objOf<T, K extends string>(
  key: K,
): (value: T) => { [x in K]: T };

export function objOf(...args: ReadonlyArray<unknown>): unknown {
  return curry(objOfImplementation, args);
}

function objOfImplementation<T, K extends string>(
  value: T,
  key: K,
): { [x in K]: T } {
  // @ts-expect-error [ts2322] - I'm not sure how to get the type right here...
  return ({ [key]: value });
}
