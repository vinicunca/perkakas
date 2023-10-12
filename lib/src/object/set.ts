import { purry } from '../function';

/**
 * Sets the `value` at `prop` of `object`.
 * @param obj the target method
 * @param prop the property name
 * @param value the value to set
 * @signature
 *    P.set(obj, prop, value)
 * @example
 *    P.set({ a: 1 }, 'a', 2) // => { a: 2 }
 * @dataFirst
 * @category Object
 */
export function set<T, K extends keyof T>(obj: T, prop: K, value: T[K]): T;

/**
 * Sets the `value` at `prop` of `object`.
 * @param prop the property name
 * @param value the value to set
 * @signature
 *    P.set(prop, value)(obj)
 * @example
 *    P.pipe({ a: 1 }, P.set('a', 2)) // => { a: 2 }
 * @dataLast
 * @category Object
 */
export function set<T, K extends keyof T>(prop: K, value: T[K]): (obj: T) => T;

export function set(...args: any[]) {
  return purry(_set, args);
}

function _set(obj: any, prop: string, value: any) {
  return {
    ...obj,
    [prop]: value,
  };
}
