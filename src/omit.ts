import { hasAtLeast } from '../../src/has-at-least';
import { fromPairs } from './from-pairs';
import { purry } from './purry';

/**
 * Returns a partial copy of an object omitting the keys specified.
 * @param propNames the property names
 * @signature
 *    omit(propNames)(obj);
 * @example
 *    pipe({ a: 1, b: 2, c: 3, d: 4 }, omit(['a', 'd'])) // => { b: 2, c: 3 }
 * @dataLast
 * @category Object
 */
export function omit<T extends object, K extends keyof T>(
  propNames: ReadonlyArray<K>
): (data: T) => Omit<T, K>;

/**
 * Returns a partial copy of an object omitting the keys specified.
 * @param data the object
 * @param propNames the property names
 * @signature
 *    omit(obj, names);
 * @example
 *    omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { b: 2, c: 3 }
 * @dataFirst
 * @category Object
 */
export function omit<T extends object, K extends keyof T>(
  data: T,
  propNames: ReadonlyArray<K>
): Omit<T, K>;

export function omit(...args: Array<any>): unknown {
  return purry(omit_, args);
}

function omit_<T extends object, K extends keyof T>(
  data: T,
  propNames: ReadonlyArray<K>,
): Omit<T, K> {
  if (!hasAtLeast(propNames, 1)) {
    return { ...data };
  }

  if (!hasAtLeast(propNames, 2)) {
    const [propName] = propNames;
    const { [propName]: omitted, ...remaining } = data;
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
