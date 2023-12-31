/**
 * A function that checks if the passed parameter is defined and narrows its type accordingly.
 * To test specifically for `undefined` (and not `null`) use the strict variant of this function.
 * @param data the variable to check
 * @signature
 *    P.isDefined(data)
 *    P.isDefined.strict(data)
 * @returns true if the passed input is defined, false otherwise
 * @example
 *    P.isDefined('string') //=> true
 *    P.isDefined(null) //=> false
 *    P.isDefined(undefined) //=> false
 *    P.isDefined.strict(null) //=> true
 *    P.isDefined.strict(undefined) //=> false
 * @category Guard
 * @strict
 */
export function isDefined<T>(data: T): data is NonNullable<T> {
  return typeof data !== 'undefined' && data !== null;
}

export namespace isDefined {
  export function strict<T>(data: T | undefined): data is T {
    return data !== undefined;
  }
}
