/**
 * A function that checks if the passed parameter is a Promise and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Promise, false otherwise.
 * @signature
 *    P.isPromise(data)
 * @example
 *    P.isPromise(Promise.resolve(5)) //=> true
 *    P.isPromise(Promise.reject(5)) //=> true
 *    P.isPromise('somethingElse') //=> false
 * @category Guard
 */
export function isPromise<T, S>(data: Promise<T> | S): data is Promise<T> {
  return data instanceof Promise;
}
