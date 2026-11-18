import { curry2 } from './internal/curry-by-arity';

type Predicate<T = unknown> = (data: T) => boolean;

/**
 * Determines whether any predicate returns true for the input data.
 *
 * @param data - The input data for predicates.
 * @param fns - The list of predicates.
 * @signature
 *    anyPass(data, fns)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    anyPass(8, fns) // => true
 *    anyPass(11, fns) // => false
 * @dataFirst
 * @category Array
 */
export function anyPass<T>(data: T, fns: ReadonlyArray<Predicate<T>>): boolean;

/**
 * Determines whether any predicate returns true for the input data.
 *
 * @param fns - The list of predicates.
 * @signature
 *    anyPass(fns)(data)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    anyPass(fns)(8) // => true
 *    anyPass(fns)(11) // => false
 * @dataLast
 * @category Array
 */
export function anyPass<T>(fns: ReadonlyArray<Predicate<T>>): (data: T) => boolean;

export function anyPass(
  dataOrFns: unknown,
  fns?: ReadonlyArray<Predicate>,
): unknown {
  return curry2(anyPassImplementation, arguments.length, dataOrFns, fns);
}

function anyPassImplementation<T>(data: T, fns: ReadonlyArray<(data: T) => boolean>): boolean {
  return fns.some((fn) => fn(data));
}
