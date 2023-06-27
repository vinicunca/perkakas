import { toString } from '../base';

type DefinitelyObject<T> = Exclude<
  Extract<T, object>,
  Array<any> | Function | ReadonlyArray<any>
> extends never
  ? Record<string, unknown>
  : Exclude<Extract<T, object>, Array<any> | Function | ReadonlyArray<any>>;
/**
 * A function that checks if the passed parameter is of type Object and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    P.isObject(data)
 * @returns true if the passed input is an Object, Promise, Date or Error, false otherwise
 * @example
 *    P.isObject({}) //=> true
 *    P.isObject(Promise.resolve("something")) //=> true
 *    P.isObject(new Date()) //=> true
 *    P.isObject(new Error("error")) //=> true
 *    P.isObject('somethingElse') //=> false
 * @category Guard
 */
export function isObject<T>(data: T | object): data is DefinitelyObject<T> {
  return toString(data) === '[object Object]';
}
