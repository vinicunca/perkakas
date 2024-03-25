import { purry } from './purry';

/**
 * Multiplies two numbers.
 *
 * @param value The number.
 * @param multiplicand The number to multiply the value by.
 * @signature
 *  multiply(value, multiplicand);
 * @example
 *  import { multiple, reduce } from '@vinicunca/perkakas';
 *
 *  multiply(3, 4) // => 12
 *  reduce([1, 2, 3, 4], multiply, 1) // => 24
 * @dataFirst
 * @category Number
 */
export function multiply(value: number, multiplicand: number): number;

/**
 * Multiplies two numbers.
 *
 * @param multiplicand The number to multiply the value by.
 * @signature
 *  multiply(multiplicand)(value);
 * @example
 *  import { multiple, map } from '@vinicunca/perkakas';
 *
 *  multiply(4)(3) // => 12
 *  map([1, 2, 3, 4], multiply(2)) // => [2, 4, 6, 8]
 * @dataLast
 * @category Number
 */
export function multiply(multiplicand: number): (value: number) => number;

export function multiply(...args: Array<any>): unknown {
  return purry(multiply_, args);
}

function multiply_(value: number, multiplicand: number): number {
  return value * multiplicand;
}
