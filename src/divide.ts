import { purry } from './purry';

/**
 * Divides two numbers.
 *
 * @param value The number.
 * @param divisor The number to divide the value by.
 * @signature
 *  divide(value, divisor);
 * @example
 *  import { divide, reduce } from '@vinicunca/perkakas';
 *
 *  divide(12, 3); // => 4
 *  reduce([1, 2, 3, 4], divide, 24); // => 1
 * @dataFirst
 * @category Number
 */
export function divide(value: number, divisor: number): number;

/**
 * Divides two numbers.
 *
 * @param divisor The number to divide the value by.
 * @signature
 *  divide(divisor)(value);
 * @example
 *  import { divide, map } from '@vinicunca/perkakas';
 *
 *  divide(3)(12); // => 4
 *  map([2, 4, 6, 8], divide(2)); // => [1, 2, 3, 4]
 * @dataLast
 * @category Number
 */
export function divide(divisor: number): (value: number) => number;

export function divide(...args: Array<any>): unknown {
  return purry(divide_, args);
}

function divide_(value: number, divisor: number): number {
  return value / divisor;
}
