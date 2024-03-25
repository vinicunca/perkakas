/**
 * A function that checks if the passed parameter is defined and narrows its
 * type accordingly. To test specifically for `undefined` (and not `null`) use
 * the strict variant of this function.
 *
 * If your type accepts `null` use `R.isNullish(data)`, otherwise prefer `R.isDefined.strict(data)`.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is defined, false otherwise.
 * @signature
 *  isDefined(data)
 *  isDefined.strict(data)
 * @example
 *  import { isDefined } from '@vinicunca/perkakas';
 *
 *  isDefined('string'); // => true
 *  isDefined(null); // => false
 *  isDefined(undefined); // => false
 *  isDefined.strict(null); // => true
 *  isDefined.strict(undefined); // => false
 * @strict
 * @category Guard
 * @deprecated If your type accepts `null` use `R.isNullish(data)`, otherwise prefer `R.isDefined.strict(data)`. The **non-strict** version will be removed in V2!
 */
export function isDefined<T>(data: T): data is NonNullable<T> {
  return data !== undefined && data !== null;
}

export namespace isDefined {
  export function strict<T>(data: T | undefined): data is T {
    return data !== undefined;
  }
}
