import { keys } from './keys';
import { purry } from './purry';

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @param object the target object
 * @param fn the predicate
 * @signature pickBy(object, fn)
 * @example
 *  import { pickBy } from '@vinicunca/perkakas';
 *
 *  pickBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key); // => {A: 3, B: 4}
 * @dataFirst
 * @category Object
 */
export function pickBy<T>(
  object: T,
  fn: <K extends keyof T>(value: T[K], key: K) => boolean
): T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @param fn the predicate
 * @signature pickBy(fn)(object)
 * @example
 *  import { pickBy } from '@vinicunca/perkakas';
 *
 *  pickBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}); // => {A: 3, B: 4}
 * @dataLast
 * @category Object
 */
export function pickBy<T>(
  fn: <K extends keyof T>(value: T[K], key: K) => boolean
): (object: T) => T extends Record<keyof T, T[keyof T]> ? T : Partial<T>;

export function pickBy(...args: Array<any>): unknown {
  return purry(pickBy_, args);
}

function pickBy_<T>(
  data: T,
  fn: <K extends keyof T>(value: T[K], key: K) => boolean,
): Partial<T> {
  if (data === null || data === undefined) {
    return {};
  }

  const out: Partial<T> = {};

  for (const key of keys.strict(data)) {
    const k = key as keyof T;
    if (fn(data[k], k)) {
      out[k] = data[k];
    }
  }

  return out;
}
