import { purry } from '../function/purry';

/**
 * Divides two numbers.
 * @param value The number.
 * @param divisor The number to divide the value by.
 * @signature
 *    P.divide(value, divisor);
 * @example
 *    P.divide(12, 3) // => 4
 *    P.reduce([1, 2, 3, 4], P.divide, 24) // => 1
 * @dataFirst
 * @category Number
 */
export function divide(value: number, divisor: number): number;

/**
 * Divides two numbers.
 * @param value The number.
 * @param divisor The number to divide the value by.
 * @signature
 *    P.divide(divisor)(value);
 * @example
 *    P.divide(3)(12) // => 4
 *    P.map([2, 4, 6, 8], P.divide(2)) // => [1, 2, 3, 4]
 * @dataLast
 * @category Number
 */
export function divide(divisor: number): (value: number) => number;

export function divide(...args: any[]): unknown {
  return purry(divide_, args);
}

function divide_(value: number, divisor: number): number {
  return value / divisor;
}
