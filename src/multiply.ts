import { curry } from './curry';

/**
 * Multiplies two numbers.
 *
 * @param value - The number.
 * @param multiplicand - The number to multiply the value by.
 * @signature
 *    P.multiply(value, multiplicand);
 * @example
 *    P.multiply(3, 4) // => 12
 *    P.reduce([1, 2, 3, 4], P.multiply, 1) // => 24
 * @dataFirst
 * @category Number
 */
export function multiply(value: bigint, multiplicand: bigint): bigint;
export function multiply(value: number, multiplicand: number): number;

/**
 * Multiplies two numbers.
 *
 * @param multiplicand - The number to multiply the value by.
 * @signature
 *    P.multiply(multiplicand)(value);
 * @example
 *    P.multiply(4)(3) // => 12
 *    P.map([1, 2, 3, 4], P.multiply(2)) // => [2, 4, 6, 8]
 * @dataLast
 * @category Number
 */
export function multiply(multiplicand: bigint): (value: bigint) => bigint;
export function multiply(multiplicand: number): (value: number) => number;

export function multiply(...args: ReadonlyArray<unknown>): unknown {
  return curry(multiplyImplementation, args);
}

// The implementation only uses `number` types, but that's just because it's
// hard to tell typescript that both value and multiplicand would be of the same
// type.
function multiplyImplementation(value: number, multiplicand: number): number {
  return value * multiplicand;
}
