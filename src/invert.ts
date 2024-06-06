import type { Simplify } from 'type-fest';

import { curry } from './curry';

type Inverted<T extends object> = Simplify<{
  -readonly [K in keyof T as K extends number | string
    ? Required<T>[K] extends PropertyKey
      ? Required<T>[K]
      : never
    : never]: `${K extends number | string ? K : never}`;
}>;

/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @param object - The object.
 * @signature
 *    P.invert(object)
 * @example
 *    P.invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @dataFirst
 * @category Object
 */
export function invert<T extends object>(object: T): Inverted<T>;

/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @signature
 *    P.invert()(object)
 * @example
 *    P.pipe({ a: "d", b: "e", c: "f" }, P.invert()); // => { d: "a", e: "b", f: "c" }
 * @dataLast
 * @category Object
 */
export function invert<T extends object>(): (object: T) => Inverted<T>;

export function invert(...args: ReadonlyArray<unknown>): unknown {
  return curry(invertImplementation, args);
}

function invertImplementation(
  data: Readonly<Record<PropertyKey, PropertyKey>>,
): Record<PropertyKey, PropertyKey> {
  const result: Record<PropertyKey, PropertyKey> = {};

  for (const [key, value] of Object.entries(data)) {
    result[value] = key;
  }

  return result;
}
