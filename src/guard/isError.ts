type DefinitelyError<T> = Extract<T, Error> extends never
  ? Error
  : Extract<T, Error>;
/**
 * A function that checks if the passed parameter is an Error and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    P.isError(data)
 * @returns true if the passed input is an Error, false otherwise
 * @example
 *    P.isError(new Error('message')) //=> true
 *    P.isError('somethingElse') //=> false
 * @category Guard
 */
export function isError<T>(data: T | Error): data is DefinitelyError<T> {
  return data instanceof Error;
}
