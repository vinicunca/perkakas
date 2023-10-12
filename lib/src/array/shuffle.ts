import { purry } from '../function';

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 * @param items the array to shuffle
 * @signature
 *    P.shuffle(array)
 * @example
 *    P.shuffle([4, 2, 7, 5]) // => [7, 5, 4, 2]
 * @category Array
 * @dataFirst
 */
export function shuffle<T>(items: ReadonlyArray<T>): Array<T>;

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 * @signature
 *    P.shuffle()(array)
 * @example
 *    P.pipe([4, 2, 7, 5], P.shuffle()) // => [7, 5, 4, 2]
 * @category Array
 * @dataLast
 */
export function shuffle<T>(): (items: ReadonlyArray<T>) => Array<T>;

export function shuffle(...args: any[]) {
  return purry(_shuffle, args);
}

function _shuffle<T>(items: ReadonlyArray<T>): Array<T> {
  const result = items.slice();
  for (let index = 0; index < items.length; index += 1) {
    const rand = index + Math.floor(Math.random() * (items.length - index));
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return result;
}
