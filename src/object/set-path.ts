import type { Narrow } from '../utils/narrow';
import type { Path, SupportsValueAtPath, ValueAtPath } from '../utils/paths';

import { purry } from '../function/purry';

/**
 * Sets the value at `path` of `object`. `path` can be an array or a path string.
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

export function setPath(...args: any[]) {
  return purry(_setPath, args);
}

export function _setPath(
  object: any,
  path: Array<any>,
  defaultValue: any,
): any {
  if (path.length === 0) {
    return defaultValue;
  }

  if (Array.isArray(object)) {
    return object.map((item, index) => {
      if (index === path[0]) {
        return _setPath(item, path.slice(1), defaultValue);
      }
      return item;
    });
  }

  return {
    ...object,
    [path[0]]: _setPath(object[path[0]], path.slice(1), defaultValue),
  };
}
