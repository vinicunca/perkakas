import { purry } from '../function/purry';
import { withPrecision } from '../utils/with-precision';

/**
 * Rounds down a given number to a specific precision.
 * If you'd like to round down to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.floor` instead, as it won't incur the additional library overhead.
 *
 * @param value The number to round down.
 * @param precision The precision to round down to. Must be an integer between -15 and 15.
 * @signature
 *    P.floor(value, precision);
 * @example
 *    P.floor(123.9876, 3) // => 123.987
 *    P.floor(483.22243, 1) // => 483.2
 *    P.floor(8541, -1) // => 8540
 *    P.floor(456789, -3) // => 456000
 * @dataFirst
 * @category Number
 */
export function floor(value: number, precision: number): number;

/**
 * Rounds down a given number to a specific precision.
 * If you'd like to round down to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.floor` instead, as it won't incur the additional library overhead.
 *
 * @param precision The precision to round down to. Must be an integer between -15 and 15.
 * @signature
 *    P.floor(precision)(value);
 * @example
 *    P.floor(3)(123.9876) // => 123.987
 *    P.floor(1)(483.22243) // => 483.2
 *    P.floor(-1)(8541) // => 8540
 *    P.floor(-3)(456789) // => 456000
 * @dataLast
 * @category Number
 */
export function floor(precision: number): (value: number) => number;

export function floor(...args: Array<any>): unknown {
  return purry(withPrecision(Math.floor), args);
}
