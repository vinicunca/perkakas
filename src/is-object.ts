import type { NarrowedTo } from './_types';

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
 *    isObject(data)
 * @example
 *    // true
 *    isObject({}) //=> true
 *    isObject({ a: 123 }) //=> true
 *
 *    // false
 *    isObject([]) //=> false
 *    isObject(Promise.resolve("something")) //=> false
 *    isObject(new Date()) //=> false
 *    isObject(new Error("error")) //=> false
 *    isObject('somethingElse') //=> false
 *    isObject(null) //=> false
 * @category Guard
 */
export function isObject<T>(
  data: Readonly<Record<PropertyKey, unknown>> | T,
): data is NarrowedTo<T, Record<PropertyKey, unknown>> {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(data);
  return proto === null || proto === Object.prototype;
}
