import { purry } from '../function';

/**
 * Creates an object composed of the picked `object` properties.
 * @param object the target object
 * @param names the properties names
 * @signature P.pick(object, [prop1, prop2])
 * @example
 *    P.pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @dataFirst
 * @category Object
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  names: ReadonlyArray<K>
): Pick<T, K>;

/**
 * Creates an object composed of the picked `object` properties.
 * @param names the properties names
 * @signature P.pick([prop1, prop2])(object)
 * @example
 *    P.pipe({ a: 1, b: 2, c: 3, d: 4 }, P.pick(['a', 'd'])) // => { a: 1, d: 4 }
 * @dataLast
 * @category Object
 */
export function pick<T extends object, K extends keyof T>(
  names: ReadonlyArray<K>
): (object: T) => Pick<T, K>;

export function pick(...args: any[]) {
  return purry(_pick, args);
}

function _pick<T extends object, K extends keyof T>(
  object: T,
  names: ReadonlyArray<K>,
) {
  if (object == null) {
    return {};
  }

  return names.reduce<Record<PropertyKey, unknown>>((acc, name) => {
    if (name in object) {
      acc[name] = object[name];
    }
    return acc;
  }, {});
}
