import { purry } from '../function';

/**
 * Creates an object composed of the picked `object` properties.
 * @param object the target object
 * @param names the properties names
 * @signature P.pick(object, [prop1, prop2])
 * @example
 *    P.pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @data_first
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
 * @data_last
 * @category Object
 */
export function pick<K extends PropertyKey>(
  names: ReadonlyArray<K>
): <T extends Record<PropertyKey, any>>(object: T) => Pick<T, K>;

export function pick() {
  return purry(_pick, arguments);
}

function _pick(object: any, names: Array<string>) {
  if (object == null) {
    return {};
  }
  return names.reduce<any>((acc, name) => {
    if (name in object) {
      acc[name] = object[name];
    }
    return acc;
  }, {});
}
