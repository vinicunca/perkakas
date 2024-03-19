import { purry } from '../function/purry';

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

export function set(...args: Array<any>): unknown {
  return purry(set_, args);
}

function set_<T, K extends keyof T>(obj: T, prop: K, value: T[K]): T {
  return {
    ...obj,
    [prop]: value,
  };
}
