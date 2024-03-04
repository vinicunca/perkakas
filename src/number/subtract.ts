import { purry } from '../function/purry';

/**
 * Subtracts two numbers.
 * @param value The number.
 * @param subtrahend The number to subtract from the value.
 * @signature
 *    P.subtract(value, subtrahend);
 * @example
 *    P.subtract(10, 5) // => 5
 *    P.subtract(10, -5) // => 15
 *    R.reduce([1, 2, 3, 4], P.subtract, 20) // => 10
 * @dataFirst
 * @category Number
 */
export function subtract(value: number, subtrahend: number): number;

/**
 * Subtracts two numbers.
 * @param value The number.
 * @param subtrahend The number to subtract from the value.
 * @signature
 *    P.subtract(subtrahend)(value);
 * @example
 *    P.subtract(5)(10) // => 5
 *    P.subtract(-5)(10) // => 15
 *    P.map([1, 2, 3, 4], P.subtract(1)) // => [0, 1, 2, 3]
 * @dataLast
 * @category Number
 */
export function subtract(subtrahend: number): (value: number) => number;

export function subtract(...args: any[]) {
  return purry(_subtract, args);
}

function _subtract(value: number, subtrahend: number) {
  return value - subtrahend;
}
