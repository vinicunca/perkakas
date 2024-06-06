/* eslint-disable ts/ban-types --
 * We want to match the typing of the built-in Object.entries as much as
 * possible!
 */

import type { Simplify } from 'type-fest';

import { curry } from './curry';

// Object.entries only returns enumerable keys, skipping symbols. It also
// only returns string keys, translating numbers to strings.
type EntryForKey<T, Key extends keyof T> = Key extends number | string
  ? [key: `${Key}`, value: Required<T>[Key]]
  : never;

type Entry<T> = Simplify<{ [P in keyof T]-?: EntryForKey<T, P> }[keyof T]>;

/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @param data - Object to return keys and values of.
 * @signature
 *    P.entries(object)
 * @example
 *    P.entries({ a: 1, b: 2, c: 3 }); // => [['a', 1], ['b', 2], ['c', 3]]
 * @dataFirst
 * @category Object
 */
export function entries<T extends {}>(data: T): Array<Entry<T>>;

/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @signature
 *    P.entries()(object)
 * @example
 *    P.pipe({ a: 1, b: 2, c: 3 }, P.entries()); // => [['a', 1], ['b', 2], ['c', 3]]
 * @dataLast
 * @category Object
 */
export function entries(): <T extends {}>(data: T) => Array<Entry<T>>;

export function entries(...args: ReadonlyArray<unknown>): unknown {
  return curry(Object.entries, args);
}
