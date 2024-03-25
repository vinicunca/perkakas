import { purry } from './purry';

/**
 * Determines whether all predicates returns true for the input data.
 *
 * @param data The input data for predicates.
 * @param fns The list of predicates.
 * @signature
 *  allPass(data, fns)
 * @example
 *  import { allPass } from '@vinicunca/perkakas';
 *
 *  const isDivisibleBy3 = (x: number) => x % 3 === 0
 *  const isDivisibleBy4 = (x: number) => x % 4 === 0
 *  const fns = [isDivisibleBy3, isDivisibleBy4]
 *
 *  allPass(12, fns); // => true
 *  allPass(8, fns); // => false
 * @dataFirst
 * @category Array
 */
export function allPass<T>(
  data: T,
  fns: ReadonlyArray<(data: T) => boolean>
): boolean;

/**
 * Determines whether all predicates returns true for the input data.
 *
 * @param fns The list of predicates.
 * @signature
 *  allPass(fns)(data)
 * @example
 *  import { allPass } from '@vinicunca/perkakas';
 *
 *  const isDivisibleBy3 = (x: number) => x % 3 === 0
 *  const isDivisibleBy4 = (x: number) => x % 4 === 0
 *  const fns = [isDivisibleBy3, isDivisibleBy4]
 *  allPass(fns)(12); // => true
 *  allPass(fns)(8); // => false
 * @dataLast
 * @category Array
 */
export function allPass<T>(
  fns: ReadonlyArray<(data: T) => boolean>
): (data: T) => boolean;

export function allPass(...args: Array<any>): unknown {
  return purry(allPass_, args);
}

function allPass_<T>(
  data: T,
  fns: ReadonlyArray<(data: T) => boolean>,
): boolean {
  return fns.every((fn) => fn(data));
}
