import { purry } from './purry';

/**
 * Subtracts two numbers.
 *
 * @param value The number.
 * @param subtrahend The number to subtract from the value.
 * @signature
 *  subtract(value, subtrahend);
 * @example
 *  import { subtract, reduce } from '@vinicunca/perkakas';
 *
 *  subtract(10, 5) // => 5
 *  subtract(10, -5) // => 15
 *  reduce([1, 2, 3, 4], subtract, 20) // => 10
 * @dataFirst
 * @category Number
 */
export function subtract(value: number, subtrahend: number): number;

/**
 * Subtracts two numbers.
 *
 * @param subtrahend The number to subtract from the value.
 * @signature
 *  subtract(subtrahend)(value);
 * @example
 *  import { subtract, map } from '@vinicunca/perkakas';
 *
 *  subtract(5)(10) // => 5
 *  subtract(-5)(10) // => 15
 *  map([1, 2, 3, 4], subtract(1)) // => [0, 1, 2, 3]
 * @dataLast
 * @category Number
 */
export function subtract(subtrahend: number): (value: number) => number;

export function subtract(...args: Array<any>): unknown {
  return purry(subtract_, args);
}

function subtract_(value: number, subtrahend: number): number {
  return value - subtrahend;
}
