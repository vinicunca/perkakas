import { purry } from './purry';

/**
 * Adds two numbers.
 *
 * @param value The number.
 * @param addend The number to add to the value.
 * @signature
 *    P.add(value, addend);
 * @example
 *    import { add, reduce } from '@vinicunca/perkakas';
 *
 *    add(10, 5) // => 15
 *    add(10, -5) // => 5
 *    reduce([1, 2, 3, 4], add, 0) // => 10
 * @dataFirst
 * @category Number
 */
export function add(value: number, addend: number): number;

/**
 * Adds two numbers.
 *
 * @param addend The number to add to the value.
 * @signature
 *    P.add(addend)(value);
 * @example
 *    import { add, map } from '@vinicunca/perkakas';
 *
 *    add(5)(10) // => 15
 *    add(-5)(10) // => 5
 *    map([1, 2, 3, 4], add(1)) // => [2, 3, 4, 5]
 * @dataLast
 * @category Number
 */
export function add(addend: number): (value: number) => number;

export function add(...args: Array<any>): unknown {
  return purry(add_, args);
}

function add_(value: number, addend: number) {
  return value + addend;
}
