import type { PredIndexed, PredIndexedOptional } from './_types';

import { purry } from './purry';

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` type guard passes, and the second one containing the rest.
 * @param items the items to split
 * @param predicate a type guard function to invoke on every item
 * @returns the array of grouped elements.
 * @signature
 *  partition(array, fn)
 * @example
 *  import { partition } from '@vinicunca/perkakas';
 *
 *  partition(['one', 'two', 'forty two'], x => x.length === 3); // => [['one', 'two'], ['forty two']]
 * @dataFirst
 * @indexed
 * @category Array
 */
export function partition<T, S extends T>(
  items: ReadonlyArray<T>,
  predicate: (item: T) => item is S
): [Array<S>, Array<Exclude<T, S>>];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` function matches, and the second one containing the rest.
 * @param items the items to split
 * @param predicate the function invoked per iteration
 * @returns the array of grouped elements.
 * @signature
 *  partition(array, fn)
 * @example
 *  import { partition } from '@vinicunca/perkakas';
 *
 *  partition(['one', 'two', 'forty two'], x => x.length === 3); // => [['one', 'two'], ['forty two']]
 * @dataFirst
 * @indexed
 * @category Array
 */
export function partition<T>(
  items: ReadonlyArray<T>,
  predicate: (item: T) => boolean
): [Array<T>, Array<T>];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` type guard passes, and the second one containing the rest.
 * @param predicate the grouping function
 * @returns the array of grouped elements.
 * @signature
 *  partition(fn)(array)
 * @example
 *  import { partition, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(['one', 'two', 'forty two'], partition(x => x.length === 3)); // => [['one', 'two'], ['forty two']]
 * @dataLast
 * @indexed
 * @category Array
 */
export function partition<T, S extends T>(
  predicate: (item: T) => item is S
): (array: ReadonlyArray<T>) => [Array<S>, Array<Exclude<T, S>>];

/**
 * Splits a collection into two groups, the first of which contains elements the `predicate` function matches, and the second one containing the rest.
 * @param predicate the grouping function
 * @returns the array of grouped elements.
 * @signature
 *  partition(fn)(array)
 * @example
 *  import { partition, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(['one', 'two', 'forty two'], partition(x => x.length === 3)); // => [['one', 'two'], ['forty two']]
 * @dataLast
 * @indexed
 * @category Array
 */
export function partition<T>(
  predicate: (item: T) => boolean
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function partition(...args: Array<any>): unknown {
  return purry(partition_(false), args);
}

function partition_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    const ret: [Array<T>, Array<T>] = [[], []];
    for (const [index, item] of array.entries()) {
      const matches = indexed ? fn(item, index, array) : fn(item);
      ret[matches ? 0 : 1].push(item);
    }
    return ret;
  };
}

export namespace partition {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    predicate: PredIndexed<T, boolean>
  ): [Array<T>, Array<T>];
  export function indexed<T>(
    predicate: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];
  export function indexed(...args: Array<any>): unknown {
    return purry(partition_(true), args);
  }
}
