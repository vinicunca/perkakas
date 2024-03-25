import { purry } from '../purry';

type Inverted<T extends object> = T[keyof T] extends PropertyKey
  ? Record<T[keyof T], keyof T>
  : never;

/**
 * Returns an object whose keys are values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @param object the object
 * @signature
 *    invert(object)
 * @example
 *    invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @dataFirst
 * @category Object
 * @pipeable
 */
export function invert<T extends object>(object: T): Inverted<T>;

/**
 * Returns an object whose keys are values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @signature
 *    invert()(object)
 * @example
 *    pipe({ a: "d", b: "e", c: "f" }, invert()); // => { d: "a", e: "b", f: "c" }
 * @dataLast
 * @category Object
 * @pipeable
 */
export function invert<T extends object>(): (object: T) => Inverted<T>;

export function invert(...args: Array<any>): unknown {
  return purry(invert_, args);
}

function invert_(
  object: Readonly<Record<PropertyKey, PropertyKey>>,
): Record<PropertyKey, PropertyKey> {
  const result: Record<PropertyKey, PropertyKey> = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const key in object) {
    // @see https://eslint.org/docs/latest/rules/guard-for-in
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[object[key]!] = key;
    }
  }

  return result;
}
