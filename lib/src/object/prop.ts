/**
 * Gets the value of the given property.
 * @param propName the property name
 * @signature P.prop(prop)(object)
 * @example
 *    P.pipe({foo: 'bar'}, P.prop('foo')) // => 'bar'
 * @dataLast
 * @category Object
 */
export function prop<T, K extends keyof T>(propName: K) {
  return ({ [propName]: value }: T) => value;
}
