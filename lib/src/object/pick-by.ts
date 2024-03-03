import { purry } from '../function/purry';
import { keys } from './keys';

/**
 * Creates an object composed of the picked `object` properties.
 * @param object the target object
 * @param fn the predicate
 * @signature P.pickBy(object, fn)
 * @example
 *    P.pickBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {A: 3, B: 4}
 * @dataFirst
 * @category Object
 */
export function pickBy<T>(
  object: T,
  fn: <K extends keyof T>(value: T[K], key: K) => boolean
): T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

/**
 * Creates an object composed of the picked `object` properties.
 * @param fn the predicate
 * @signature P.pickBy(fn)(object)
 * @example
 *    P.pickBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {A: 3, B: 4}
 * @dataLast
 * @category Object
 */
export function pickBy<T>(
  fn: <K extends keyof T>(value: T[K], key: K) => boolean
): (object: T) => T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

export function pickBy(...args: any[]) {
  return purry(_pickBy, args);
}

function _pickBy<T>(
  object: T,
  fn: <K extends keyof T>(value: T[K], key: K) => boolean,
): Partial<T> {
  if (object == null) {
    return {};
  }
  return keys.strict(object).reduce<Partial<T>>((acc, key) => {
    if (fn(object[key], key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
}
