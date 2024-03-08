import { purry } from '../function/purry';

/**
 * Multiplies two numbers.
 * @param value The number.
 * @param multiplicand The number to multiply the value by.
 * @signature
 *    P.multiply(value, multiplicand);
 * @example
 *    P.multiply(3, 4) // => 12
 *    P.reduce([1, 2, 3, 4], P.multiply, 1) // => 24
 * @dataFirst
 * @category Number
 */
export function multiply(value: number, multiplicand: number): number;

/**
 * Multiplies two numbers.
 * @param value The number.
 * @param multiplicand The number to multiply the value by.
 * @signature
 *    P.multiply(multiplicand)(value);
 * @example
 *    P.multiply(4)(3) // => 12
 *    P.map([1, 2, 3, 4], P.multiply(2)) // => [2, 4, 6, 8]
 * @dataLast
 * @category Number
 */
export function multiply(multiplicand: number): (value: number) => number;

export function multiply(...args: any[]): unknown {
  return purry(multiply_, args);
}

function multiply_(value: number, multiplicand: number): number {
  return value * multiplicand;
}
