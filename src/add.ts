import { curry } from './curry';

/**
 * Adds two numbers.
 *
 * @param value - The number.
 * @param addend - The number to add to the value.
 * @signature
 *    P.add(value, addend);
 * @example
 *    P.add(10, 5) // => 15
 *    P.add(10, -5) // => 5
 *    P.reduce([1, 2, 3, 4], P.add, 0) // => 10
 * @dataFirst
 * @category Number
 */
export function add(value: bigint, addend: bigint): bigint;
export function add(value: number, addend: number): number;

/**
 * Adds two numbers.
 *
 * @param addend - The number to add to the value.
 * @signature
 *    P.add(addend)(value);
 * @example
 *    P.add(5)(10) // => 15
 *    P.add(-5)(10) // => 5
 *    P.map([1, 2, 3, 4], P.add(1)) // => [2, 3, 4, 5]
 * @dataLast
 * @category Number
 */
export function add(addend: bigint): (value: bigint) => bigint;
export function add(addend: number): (value: number) => number;

export function add(...args: ReadonlyArray<unknown>): unknown {
  return curry(addImplementation, args);
}

function addImplementation(value: number, addend: number): number {
  return value + addend;
}
