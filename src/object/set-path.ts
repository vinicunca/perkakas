import type { Narrow } from '../utils/narrow';
import type { Path, SupportsValueAtPath, ValueAtPath } from '../utils/paths';

import { purry } from '../function/purry';

/**
 * Sets the value at `path` of `object`. `path` can be an array or a path string.
 *
 * @param object the target method
 * @param path the property name
 * @param value the value to set
 * @signature
 *    P.setPath(obj, path, value)
 * @example
 *    P.setPath({ a: { b: 1 } }, ['a', 'b'], 2) // => { a: { b: 2 } }
 * @dataFirst
 * @category Object
 */
export function setPath<T, TPath extends Array<PropertyKey> & Path<T>>(
  object: T,
  path: Narrow<TPath>,
  value: ValueAtPath<T, TPath>
): T;

/**
 * Sets the value at `path` of `object`. `path` can be an array or a path string.
 *
 * @param path the property name
 * @param value the value to set
 * @signature
 *    P.setPath(path, value)
 * @example
 *    P.pipe({ a: { b: 1 } }, P.setPath(['a', 'b'], 2)) // { a: { b: 2 } }
 * @dataFirst
 * @category Object
 */
export function setPath<TPath extends Array<PropertyKey>, Value>(
  path: Narrow<TPath>,
  value: Value
): <Obj>(object: SupportsValueAtPath<Obj, TPath, Value>) => Obj;

export function setPath(...args: Array<any>): unknown {
  return purry(setPath_, args);
}

export function setPath_(
  data: unknown,
  path: ReadonlyArray<PropertyKey>,
  value: unknown,
): unknown {
  const [current, ...rest] = path;
  if (current === undefined) {
    return value;
  }

  if (Array.isArray(data)) {
    return data.map((item: unknown, index) =>
      index === current ? setPath_(item, rest, value) : item);
  }

  if (data === null || data === undefined) {
    throw new Error('Path doesn\'t exist in object!');
  }

  return {
    ...data,
    [current]: setPath_(
      (data as Record<PropertyKey, unknown>)[current],
      rest,
      value,
    ),
  };
}
