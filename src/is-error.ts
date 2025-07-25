type DefinitelyError<T>
  = Extract<T, Error> extends never ? Error : Extract<T, Error>;
/**
 * A function that checks if the passed parameter is an Error and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is an Error, false otherwise.
 * @signature
 *    P.isError(data)
 * @example
 *    P.isError(new Error('message')) //=> true
 *    P.isError('somethingElse') //=> false
 * @category Guard
 */
export function isError<T>(data: Error | T): data is DefinitelyError<T> {
  return data instanceof Error;
}
