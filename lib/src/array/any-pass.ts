import { purry } from '../function';

/**
 * Determines whether any predicate returns true for the input data.
 * @param data The input data for predicates.
 * @param fns The list of predicates.
 * @signature
 *    P.anyPass(data, fns)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    P.anyPass(8, fns) // => true
 *    P.anyPass(11, fns) // => false
 * @data_first
 * @category Array
 */
export function anyPass<T>(
  data: T,
  fns: ReadonlyArray<(data: T) => boolean>
): boolean;

/**
 * Determines whether any predicate returns true for the input data.
 * @param fns The list of predicates.
 * @signature
 *    P.anyPass(fns)(data)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    P.anyPass(fns)(8) // => true
 *    P.anyPass(fns)(11) // => false
 * @data_last
 * @category Array
 */
export function anyPass<T>(
  fns: ReadonlyArray<(data: T) => boolean>
): (data: T) => boolean;

export function anyPass() {
  return purry(_anyPass, arguments);
}

function _anyPass(data: any, fns: Array<(data: any) => boolean>) {
  return fns.some((fn) => fn(data));
}
