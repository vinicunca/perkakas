import type { IterableContainer } from '../utils/types';

import { purry } from '../function/purry';

/**
 * Sorts an array. The comparator function should accept two values at a time and return a negative number if the first value is smaller, a positive number if it's larger, and zero if they are equal.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 *
 * If the input array is more complex (non-empty array, tuple, etc...) use the
 * strict mode to maintain it's shape.
 *
 * @param items the array to sort
 * @param cmp the comparator function
 * @signature
 *    P.sort(items, cmp)
 *    P.sort.strict(items, cmp)
 * @example
 *    P.sort([4, 2, 7, 5], (a, b) => a - b) // => [2, 4, 5, 7] typed Array<number>
 *    P.sort.strict([4, 2] as [number, number], (a, b) => a - b) // [2, 4] typed [number, number]
 * @dataFirst
 * @category Array
 * @strict
 */
export function sort<T>(
  items: ReadonlyArray<T>,
  cmp: (a: T, b: T) => number
): Array<T>;

/**
 * Sorts an array. The comparator function should accept two values at a time and return a negative number if the first value is smaller, a positive number if it's larger, and zero if they are equal.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 *
 * If the input array is more complex (non-empty array, tuple, etc...) use the
 * strict mode to maintain it's shape.
 *
 * @param cmp the comparator function
 * @signature
 *    P.sort(cmp)(items)
 *    P.sort.strict(cmp)(items)
 * @example
 *    P.pipe([4, 2, 7, 5], P.sort((a, b) => a - b)) // => [2, 4, 5, 7] typed Array<number>
 *    P.pipe([4, 2] as [number, number], P.sort.strict((a, b) => a - b)) // => [2, 4] typed [number, number]
 * @dataLast
 * @category Array
 * @strict
 */
export function sort<T>(
  cmp: (a: T, b: T) => number
): (items: ReadonlyArray<T>) => Array<T>;

export function sort(...args: Array<any>): unknown {
  return purry(sort_, args);
}

function sort_<T>(
  items: ReadonlyArray<T>,
  cmp: (a: T, b: T) => number,
): Array<T> {
  const ret = items.slice();
  ret.sort(cmp);
  return ret;
}

interface Strict {
  <T extends IterableContainer>(
    items: T,
    cmp: (a: T[number], b: T[number]) => number
  ): Sorted<T>;

  <T extends IterableContainer>(cmp: (a: T[number], b: T[number]) => number): (
    items: T
  ) => Sorted<T>;
}

type Sorted<T extends IterableContainer> = {
  -readonly [P in keyof T]: T[number];
};

export namespace sort {
  export const strict: Strict = sort;
}
