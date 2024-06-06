import { curry } from './curry';

/**
 * Divides two numbers.
 *
 * @param value - The number.
 * @param divisor - The number to divide the value by.
 * @signature
 *    P.divide(value, divisor);
 * @example
 *    P.divide(12, 3) // => 4
 *    P.reduce([1, 2, 3, 4], P.divide, 24) // => 1
 * @dataFirst
 * @category Number
 */
export function divide(value: bigint, divisor: bigint): bigint;
export function divide(value: number, divisor: number): number;

/**
 * Divides two numbers.
 *
 * @param divisor - The number to divide the value by.
 * @signature
 *    P.divide(divisor)(value);
 * @example
 *    P.divide(3)(12) // => 4
 *    P.map([2, 4, 6, 8], P.divide(2)) // => [1, 2, 3, 4]
 * @dataLast
 * @category Number
 */
export function divide(divisor: bigint): (value: bigint) => bigint;
export function divide(divisor: number): (value: number) => number;

export function divide(...args: ReadonlyArray<unknown>): unknown {
  return curry(divideImplementation, args);
}

function divideImplementation(value: number, divisor: number): number {
  return value / divisor;
}
