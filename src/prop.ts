/**
 * Gets the value of the given property.
 * @param propName the property name
 * @signature prop(prop)(object)
 * @example
 *    pipe({foo: 'bar'}, prop('foo')) // => 'bar'
 * @dataLast
 * @category Object
 */
export function prop<T, K extends keyof T>(propName: K) {
  return ({ [propName]: value }: T): T[K] => value;
}
