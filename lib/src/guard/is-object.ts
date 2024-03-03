import type { NarrowedTo } from '../utils/types';

/**
 * Checks if `data` is a "plain" object. A plain object is defined as an object with string keys and values of any type, including primitives, other objects, functions, classes, etc (aka struct/shape/record/simple). Technically, a plain object is one whose prototype is either `Object.prototype` or `null`, ensuring it does not inherit properties or methods from other object types.
 *
 * This function is narrower in scope than `isObjectType`, which accepts any entity considered an `"object"` by JavaScript's `typeof`.
 *
 * Note that Maps, Arrays, and Sets are not considered plain objects and would return `false`.
 *
 * @param data - The variable to check.
 * @returns - The input type, narrowed to only plain objects.
 * @signature
 *    P.isObject(data)
 * @example
 *    // true
 *    P.isObject({}) //=> true
 *    P.isObject({ a: 123 }) //=> true
 *
 *    // false
 *    P.isObject([]) //=> false
 *    P.isObject(Promise.resolve("something")) //=> false
 *    P.isObject(new Date()) //=> false
 *    P.isObject(new Error("error")) //=> false
 *    P.isObject('somethingElse') //=> false
 *    P.isObject(null) //=> false
 * @category Guard
 */
export function isObject<T>(
  data: Record<PropertyKey, unknown> | T,
): data is NarrowedTo<T, Record<PropertyKey, unknown>> {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(data);
  return proto === null || proto === Object.prototype;
}
