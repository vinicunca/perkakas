/**
 * Gets the value of the given property.
 * @param propName the property name
 * @signature P.prop(prop)(object)
 * @example
 *    P.pipe({foo: 'bar'}, P.prop('foo')) // => 'bar'
 * @data_last
 * @category Object
 */
export const prop =
  <T, K extends keyof T>(propName: K) =>
  ({ [propName]: value }: T) =>
    value;
