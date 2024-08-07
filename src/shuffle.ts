import type { IterableContainer, ReorderedArray } from './helpers/types';

import { curry } from './curry';

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 *
 * @param items - The array to shuffle.
 * @signature
 *    P.shuffle(array)
 * @example
 *    P.shuffle([4, 2, 7, 5]) // => [7, 5, 4, 2]
 * @dataFirst
 * @category Array
 */
export function shuffle<T extends IterableContainer>(
  items: T,
): ReorderedArray<T>;

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 *
 * @signature
 *    P.shuffle()(array)
 * @example
 *    P.pipe([4, 2, 7, 5], P.shuffle()) // => [7, 5, 4, 2]
 * @dataLast
 * @category Array
 */
export function shuffle(): <T extends IterableContainer>(
  items: T,
) => ReorderedArray<T>;

export function shuffle(...args: ReadonlyArray<unknown>): unknown {
  return curry(shuffleImplementation, args);
}

function shuffleImplementation<T>(items: ReadonlyArray<T>): Array<T> {
  const result = [...items];
  for (let index = 0; index < items.length; index++) {
    const rand = index + Math.floor(Math.random() * (items.length - index));
    const value = result[rand]!;
    result[rand] = result[index]!;
    result[index] = value;
  }
  return result;
}
