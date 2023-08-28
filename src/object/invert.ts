import { purry } from '../function';

type Inverted<T extends object> = T[keyof T] extends PropertyKey
  ? Record<T[keyof T], keyof T>
  : never;

/**
 * Returns an object whose keys are values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 * @param object the object
 * @signature
 *    P.invert(object)
 * @example
 *    P.invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @data_first
 * @category object
 * @pipeable
 */
export function invert<T extends object>(object: T): Inverted<T>;

/**
 * Returns an object whose keys are values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 * @param object the object
 * @signature
 *    P.invert()(object)
 * @example
 *    P.pipe({ a: "d", b: "e", c: "f" }, P.invert()); // => { d: "a", e: "b", f: "c" }
 * @data_last
 * @category object
 * @pipeable
 */
export function invert<T extends object>(): (object: T) => Inverted<T>;

export function invert() {
  return purry(_invert, arguments);
}

function _invert(
  object: Readonly<Record<PropertyKey, PropertyKey>>,
): Record<PropertyKey, PropertyKey> {
  const result: Record<PropertyKey, PropertyKey> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in object) {
    result[object[key]] = key;
  }

  return result;
}
