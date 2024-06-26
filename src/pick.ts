import { curry } from './curry';

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @param names - The properties names.
 * @signature P.pick([prop1, prop2])(object)
 * @example
 *    P.pipe({ a: 1, b: 2, c: 3, d: 4 }, P.pick(['a', 'd'])) // => { a: 1, d: 4 }
 * @dataLast
 * @category Object
 */
export function pick<T extends object, K extends keyof T>(
  names: ReadonlyArray<K>,
): (object: T) => Pick<T, K>;

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @param object - The target object.
 * @param names - The properties names.
 * @signature P.pick(object, [prop1, prop2])
 * @example
 *    P.pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @dataFirst
 * @category Object
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  names: ReadonlyArray<K>,
): Pick<T, K>;

export function pick(...args: ReadonlyArray<unknown>): unknown {
  return curry(pickImplementation, args);
}

function pickImplementation<T extends object, K extends keyof T>(
  object: T,
  names: ReadonlyArray<K>,
): Pick<T, K> {
  const out: Partial<Pick<T, K>> = {};
  for (const name of names) {
    if (name in object) {
      out[name] = object[name];
    }
  }
  // @ts-expect-error [ts2322] - We build the type incrementally, there's no way to make typescript infer that we "finished" building the object and to treat it as such.
  return out;
}
