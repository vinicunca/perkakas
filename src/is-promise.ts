/**
 * A function that checks if the passed parameter is a Promise and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    isPromise(data)
 * @returns true if the passed input is a Promise, false otherwise
 * @example
 *    isPromise(Promise.resolve(5)) //=> true
 *    isPromise(Promise.reject(5)) //=> true
 *    isPromise('somethingElse') //=> false
 * @category Guard
 */
export function isPromise<T, S>(data: Promise<T> | S): data is Promise<T> {
  return data instanceof Promise;
}
