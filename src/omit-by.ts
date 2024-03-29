import { keys } from './keys';
import { purry } from './purry';

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 * @param object the target object
 * @param fn the predicate
 * @signature omitBy(object, fn)
 * @example
 *  import { omitBy } from '@vinicunca/perkakas';
 *
 *  omitBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {a: 1, b: 2}
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
 * @signature omitBy(fn)(object)
 * @example
 *  import { omitBy } from '@vinicunca/perkakas';
 *
 *  omitBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {a: 1, b: 2}
 * @dataLast
 * @category Object
 */
export function omitBy<T>(
  fn: <K extends keyof T>(value: T[K], key: K) => boolean
): (object: T) => T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

export function omitBy(...args: Array<any>): unknown {
  return purry(omitBy_, args);
}

function omitBy_<T>(
  object: T,
  fn: <K extends keyof T>(value: T[K], key: K) => boolean,
): Partial<T> {
  if (object === undefined || object === null) {
    return object;
  }

  const out: Partial<T> = {};

  for (const key of keys.strict(object)) {
    const k = key as keyof T;
    if (!fn(object[k], k)) {
      out[k] = object[k];
    }
  }

  return out;
}
