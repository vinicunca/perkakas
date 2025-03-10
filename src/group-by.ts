import type { ExactRecord } from './internal/types/exact-record';
import type { NonEmptyArray } from './internal/types/non-empty-array';

import { curry } from './curry';

/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided callback function. The returned object has separate
 * properties for each group, containing arrays with the elements in the group.
 * Unlike the built in `Object.groupBy` this function also allows the callback to
 * return `undefined` in order to exclude the item from being added to any
 * group.
 *
 * @param data - The items to group.
 * @param callbackfn - A function to execute for each element in the iterable.
 * It should return a value indicating the group of the current element, or
 * `undefined` when the item should be excluded from any group.
 * @returns An object with properties for all groups, each assigned to an array
 * containing the elements of the associated group.
 * @signature
 *    P.groupBy(data, callbackfn)
 * @example
 *    P.groupBy([{a: 'cat'}, {a: 'dog'}] as const, P.prop('a')) // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 *    P.groupBy([0, 1], x => x % 2 === 0 ? 'even' : undefined) // => {even: [0]}
 * @dataFirst
 * @category Array
 */
export function groupBy<T, Key extends PropertyKey = PropertyKey>(
  data: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => Key | undefined,
): ExactRecord<Key, NonEmptyArray<T>>;

/**
 * Groups the elements of a given iterable according to the string values
 * returned by a provided callback function. The returned object has separate
 * properties for each group, containing arrays with the elements in the group.
 * Unlike the built in `Object.groupBy` this function also allows the callback to
 * return `undefined` in order to exclude the item from being added to any
 * group.
 *
 * @param callbackfn - A function to execute for each element in the iterable.
 * It should return a value indicating the group of the current element, or
 * `undefined` when the item should be excluded from any group.
 * @returns An object with properties for all groups, each assigned to an array
 * containing the elements of the associated group.
 * @signature
 *    P.groupBy(callbackfn)(data);
 * @example
 *    P.pipe(
 *      [{a: 'cat'}, {a: 'dog'}] as const,
 *      P.groupBy(P.prop('a')),
 *    ); // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
 *    P.pipe(
 *      [0, 1],
 *      P.groupBy(x => x % 2 === 0 ? 'even' : undefined),
 *    ); // => {even: [0]}
 * @dataLast
 * @category Array
 */
export function groupBy<T, Key extends PropertyKey = PropertyKey>(
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => Key | undefined,
): (items: ReadonlyArray<T>) => ExactRecord<Key, NonEmptyArray<T>>;

export function groupBy(...args: ReadonlyArray<unknown>): unknown {
  return curry(groupByImplementation, args);
}

function groupByImplementation<T, Key extends PropertyKey = PropertyKey>(
  data: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => Key | undefined,
): ExactRecord<Key, NonEmptyArray<T>> {
  const output = new Map<Key, Array<T>>();

  for (const [index, item] of data.entries()) {
    const key = callbackfn(item, index, data);
    if (key !== undefined) {
      let items = output.get(key);
      if (items === undefined) {
        items = [];
        output.set(key, items);
      }
      items.push(item);
    }
  }

  return Object.fromEntries(output) as ExactRecord<Key, NonEmptyArray<T>>;
};
