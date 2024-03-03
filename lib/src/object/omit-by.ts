import { purry } from '../function/purry';
import { keys } from './keys';

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 * @param object the target object
 * @param fn the predicate
 * @signature P.omitBy(object, fn)
 * @example
 *    P.omitBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {a: 1, b: 2}
 * @dataFirst
 * @category Object
 */
export function omitBy<T>(
  object: T,
  fn: <K extends keyof T>(value: T[K], key: K) => boolean
): T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 * @param fn the predicate
 * @signature P.omitBy(fn)(object)
 * @example
 *    P.omitBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {a: 1, b: 2}
 * @dataLast
 * @category Object
 */
export function omitBy<T>(
  fn: <K extends keyof T>(value: T[K], key: K) => boolean
): (object: T) => T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

export function omitBy(...args: any[]) {
  return purry(_omitBy, args);
}

function _omitBy<T>(
  object: T,
  fn: <K extends keyof T>(value: T[K], key: K) => boolean,
) {
  if (object === undefined || object === null) {
    return object;
  }

  return keys.strict(object).reduce<Partial<T>>((acc, key) => {
    if (!fn(object[key], key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
}
