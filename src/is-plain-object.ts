import type { NarrowedTo } from './helpers/types';

/**
 * Checks if `data` is a "plain" object. A plain object is defined as an object with string keys and values of any type, including primitives, other objects, functions, classes, etc (aka struct/shape/record/simple). Technically, a plain object is one whose prototype is either `Object.prototype` or `null`, ensuring it does not inherit properties or methods from other object types.
 *
 * This function is narrower in scope than `isObjectType`, which accepts any entity considered an `"object"` by JavaScript's `typeof`.
 *
 * Note that Maps, Arrays, and Sets are not considered plain objects and would return `false`.
 *
 * @param data - The variable to check.
 * @returns The input type, narrowed to only plain objects.
 * @signature
 *    P.isPlainObject(data)
 * @example
 *    // true
 *    P.isPlainObject({}) //=> true
 *    P.isPlainObject({ a: 123 }) //=> true
 *
 *    // false
 *    P.isPlainObject([]) //=> false
 *    P.isPlainObject(Promise.resolve("something")) //=> false
 *    P.isPlainObject(new Date()) //=> false
 *    P.isPlainObject(new Error("error")) //=> false
 *    P.isPlainObject('somethingElse') //=> false
 *    P.isPlainObject(null) //=> false
 * @category Guard
 */
export function isPlainObject<T>(
  data: Readonly<Record<PropertyKey, unknown>> | T,
): data is NarrowedTo<T, Record<PropertyKey, unknown>> {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(data);
  return proto === null || proto === Object.prototype;
}
