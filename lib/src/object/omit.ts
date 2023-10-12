import { purry } from '../function';
import { fromPairs } from './from-pairs';

/**
 * Returns a partial copy of an object omitting the keys specified.
 * @param data the object
 * @param propNames the property names
 * @signature
 *    P.omit(obj, names);
 * @example
 *    P.omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { b: 2, c: 3 }
 * @dataFirst
 * @category Object
 */
export function omit<T extends object, K extends keyof T>(
  data: T,
  propNames: ReadonlyArray<K>
): Omit<T, K>;

/**
 * Returns a partial copy of an object omitting the keys specified.
 * @param propNames the property names
 * @signature
 *    P.omit(propNames)(obj);
 * @example
 *    P.pipe({ a: 1, b: 2, c: 3, d: 4 }, P.omit(['a', 'd'])) // => { b: 2, c: 3 }
 * @dataLast
 * @category Object
 */
export function omit<K extends PropertyKey>(
  propNames: ReadonlyArray<K>
): <T extends object>(data: T) => Omit<T, K>;

export function omit(...args: any[]) {
  return purry(_omit, args);
}

function _omit<T extends object, K extends keyof T>(
  data: T,
  propNames: ReadonlyArray<K>,
): Omit<T, K> {
  if (propNames.length === 0) {
    return { ...data };
  }

  if (propNames.length === 1) {
    const [propName] = propNames;
    const {
      [propName]: omitted,
      ...remaining
    } = data;
    return remaining;
  }

  if (!propNames.some((propName) => propName in data)) {
    return { ...data };
  }

  const asSet = new Set(propNames);
  return fromPairs(
    Object.entries(data).filter(([key]) => !asSet.has(key as K)),
  ) as Omit<T, K>;
}
