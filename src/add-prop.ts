import type { UpsertProp } from './helpers/types';

import { curry } from './curry';

/**
 * Add a new property to an object.
 *
 * @param obj the target object
 * @param prop the property name
 * @param value the property value
 * @signature
 *  addProp(obj, prop, value)
 * @example
 *  import { addProp } from '@vinicunca/perkakas';
 *
 *  addProp({ firstName: 'john' }, 'lastName', 'doe'); // => {firstName: 'john', lastName: 'doe'}
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
 * @param prop the property name
 * @param value the property value
 * @signature
 *  addProp(prop, value)(obj)
 * @example
 *  import { addProp } from '@vinicunca/perkakas';
 *
 *  addProp('lastName', 'doe')({ firstName: 'john' }); // => {firstName: 'john', lastName: 'doe'}
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
