import type { UpsertProp } from './internal/types/upsert-prop';
import { curry } from './curry';

/**
 * Add a new property to an object.
 *
 * The function doesn't do any checks on the input object. If the property
 * already exists it will be overwritten, and the type of the new value is not
 * checked against the previous type.
 *
 * Use `set` to override values explicitly with better protections.
 *
 * @param obj the target object
 * @param prop the property name
 * @param value the property value
 * @signature
 *  P.addProp(obj, prop, value)
 * @example
 *  P.addProp({ firstName: 'john' }, 'lastName', 'doe'); // => {firstName: 'john', lastName: 'doe'}
 * @dataFirst
 * @category Object
 */
export function addProp<T, K extends PropertyKey, V>(
  obj: T,
  prop: K,
  value: V,
): UpsertProp<T, K, V>;

/**
 * Add a new property to an object.
 *
 * The function doesn't do any checks on the input object. If the property
 * already exists it will be overwritten, and the type of the new value is not
 * checked against the previous type.
 *
 * Use `set` to override values explicitly with better protections.
 *
 * @param prop the property name
 * @param value the property value
 * @signature
 *  P.addProp(prop, value)(obj)
 * @example
 *  P.addProp('lastName', 'doe')({ firstName: 'john' }); // => {firstName: 'john', lastName: 'doe'}
 * @dataLast
 * @category Object
 */
export function addProp<T, K extends PropertyKey, V>(
  prop: K,
  value: V,
): (obj: T) => UpsertProp<T, K, V>;

export function addProp(...args: ReadonlyArray<unknown>): unknown {
  return curry(addPropImplementation, args);
}

function addPropImplementation<T, K extends PropertyKey, V>(
  obj: T,
  prop: K,
  value: V,
): UpsertProp<T, K, V> {
  // @ts-expect-error [ts2322] TODO: [LOW] - Improve typing
  return {
    ...obj,
    [prop]: value,
  };
}
