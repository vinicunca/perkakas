import type { NarrowedTo } from './internal/types/narrowed-to';

/**
 * Checks if the given parameter is of type `"object"` via `typeof`, excluding `null`.
 *
 * It's important to note that in JavaScript, many entities are considered objects, like Arrays, Classes, RegExps, Maps, Sets, Dates, URLs, Promise, Errors, and more.\
 * Although technically an object too, `null` is not considered an object by this function, so that its easier to narrow nullables.
 *
 * For a more specific check that is limited to plain objects (simple struct/shape/record-like objects), consider using `isPlainObject` instead.
 * For a simpler check that only removes `null` from the type prefer `isNonNull` or `isDefined`.
 *
 * @param data - The variable to be checked for being an object type.
 * @returns The input type, narrowed to only objects.
 * @signature
 *    P.isObjectType(data)
 * @example
 *    // true
 *    P.isObjectType({}) //=> true
 *    P.isObjectType([]) //=> true
 *    P.isObjectType(Promise.resolve("something")) //=> true
 *    P.isObjectType(new Date()) //=> true
 *    P.isObjectType(new Error("error")) //=> true
 *
 *    // false
 *    P.isObjectType('somethingElse') //=> false
 *    P.isObjectType(null) //=> false
 * @dataFirst
 * @category Guard
 */
export function isObjectType<T>(
  data: object | T,
): data is NarrowedTo<T, object> {
  return typeof data === 'object' && data !== null;
}
