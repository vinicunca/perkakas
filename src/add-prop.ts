import { purry } from './purry';

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
export function addProp<
  T extends Record<PropertyKey, unknown>,
  K extends string,
  V,
>(obj: T, prop: K, value: V): T & { [x in K]: V };

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
 *  addProp('lastName', 'doe')({firstName: 'john'}); // => {firstName: 'john', lastName: 'doe'}
 * @dataLast
 * @category Object
 */
export function addProp<
  T extends Record<PropertyKey, unknown>,
  K extends string,
  V,
>(prop: K, value: V): (obj: T) => T & { [x in K]: V };

export function addProp(...args: Array<any>): unknown {
  return purry(addProp_, args);
}

function addProp_<T extends Record<PropertyKey, unknown>, K extends string, V>(
  obj: T,
  prop: K,
  value: V,
): T & { [x in K]: V } {
  return {
    ...obj,
    [prop]: value,
  };
}
