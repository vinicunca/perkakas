import type { Narrow } from './_narrow';
import type { Path, SupportsValueAtPath, ValueAtPath } from './_paths';

import { purry } from './purry';

/**
 * Sets the value at `path` of `object`. `path` can be an array or a path string.
 *
 * @param object the target method
 * @param path the property name
 * @param value the value to set
 * @signature
 *  setPath(obj, path, value)
 * @example
 *  import { setPath } from '@vinicunca/perkakas';
 *
 *  setPath({ a: { b: 1 } }, ['a', 'b'], 2); // => { a: { b: 2 } }
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
 *  setPath(path, value)
 * @example
 *  import { setPath, pipe } from '@vinicunca/perkakas';
 *
 *  pipe({ a: { b: 1 } }, setPath(['a', 'b'], 2)); // { a: { b: 2 } }
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
