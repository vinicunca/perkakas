import { curry } from './curry';

/**
 * Determines whether all predicates returns true for the input data.
 *
 * @param data - The input data for predicates.
 * @param fns - The list of predicates.
 * @signature
 *    P.allPass(data, fns)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    P.allPass(12, fns) // => true
 *    P.allPass(8, fns) // => false
 * @dataFirst
 * @category Array
 */
export function allPass<T>(
  data: T,
  fns: ReadonlyArray<(data: T) => boolean>,
): boolean;

/**
 * Determines whether all predicates returns true for the input data.
 *
 * @param fns - The list of predicates.
 * @signature
 *    P.allPass(fns)(data)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    P.allPass(fns)(12) // => true
 *    P.allPass(fns)(8) // => false
 * @dataLast
 * @category Array
 */
export function allPass<T>(
  fns: ReadonlyArray<(data: T) => boolean>,
): (data: T) => boolean;

export function allPass(...args: ReadonlyArray<unknown>): unknown {
  return curry(allPassImplementation, args);
}

function allPassImplementation<T>(
  data: T,
  fns: ReadonlyArray<(data: T) => boolean>,
): boolean {
  return fns.every((fn) => fn(data));
}
