import { purry } from '../function';

/**
 * Merges two objects. The same as `Object.assign`.
 * `b` object will override properties of `a`.
 * @param a the first object
 * @param b the second object
 * @signature
 *    P.merge(a, b)
 * @example
 *    P.merge({ x: 1, y: 2 }, { y: 10, z: 2 }) // => { x: 1, y: 10, z: 2 }
 * @dataFirst
 * @category Object
 */
export function merge<A, B>(a: A, b: B): A & B;

/**
 * Merges two objects. The same as `Object.assign`. `b` object will override properties of `a`.
 * @param b the second object
 * @signature
 *    P.merge(b)(a)
 * @example
 *    P.merge({ y: 10, z: 2 })({ x: 1, y: 2 }) // => { x: 1, y: 10, z: 2 }
 * @dataLast
 * @category Object
 */
export function merge<A, B>(b: B): (a: A) => A & B;

export function merge(...args: any[]) {
  return purry(_merge, args);
}

function _merge<A, B>(a: A, b: B) {
  return Object.assign({}, a, b);
}
