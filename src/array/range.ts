import { purry } from '../function/purry';

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 * @param start the start number
 * @param end the end number
 * @signature range(start, end)
 * @example
 *    P.range(1, 5) // => [1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
export function range(start: number, end: number): Array<number>;

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 * @param end the end number
 * @signature range(end)(start)
 * @example
 *    P.range(5)(1) // => [1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
export function range(end: number): (start: number) => Array<number>;

export function range(...args: any[]): unknown {
  return purry(range_, args);
}

function range_(start: number, end: number): Array<number> {
  const ret: Array<number> = [];
  for (let i = start; i < end; i++) {
    ret.push(i);
  }
  return ret;
}
