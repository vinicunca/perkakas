import { purry } from '../purry';

/**
 * Creates an object composed of the picked `object` properties.
 * @param names the properties names
 * @signature pick([prop1, prop2])(object)
 * @example
 *    pipe({ a: 1, b: 2, c: 3, d: 4 }, pick(['a', 'd'])) // => { a: 1, d: 4 }
 * @dataLast
 * @category Object
 */
export function pick<T extends object, K extends keyof T>(
  names: ReadonlyArray<K>,
): (object: T) => Pick<T, K>;

/**
 * Creates an object composed of the picked `object` properties.
 * @param object the target object
 * @param names the properties names
 * @signature pick(object, [prop1, prop2])
 * @example
 *    pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @dataFirst
 * @category Object
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  names: ReadonlyArray<K>,
): Pick<T, K>;

export function pick(...args: Array<any>): unknown {
  return purry(pick_, args);
}

function pick_<T extends object, K extends keyof T>(
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
