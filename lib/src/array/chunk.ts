import { purry } from '../function';
import { type IterableContainer, type NonEmptyArray } from '../utils/types';

type Chunked<T extends IterableContainer> = T[number] extends never
  ? []
  : T extends
  | readonly [unknown, ...Array<unknown>]
  | readonly [...Array<unknown>, unknown]
    ? NonEmptyArray<NonEmptyArray<T[number]>>
    : Array<NonEmptyArray<T[number]>>;

/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 * @param array the array
 * @param size the length of the chunk
 * @signature
 *    P.chunk(array, size)
 * @example
 *    P.chunk(['a', 'b', 'c', 'd'], 2) // => [['a', 'b'], ['c', 'd']]
 *    P.chunk(['a', 'b', 'c', 'd'], 3) // => [['a', 'b', 'c'], ['d']]
 * @data_first
 * @category Array
 */
export function chunk<T extends IterableContainer>(
  array: T,
  size: number
): Chunked<T>;

/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 * @param size the length of the chunk
 * @signature
 *    P.chunk(size)(array)
 * @example
 *    P.chunk(2)(['a', 'b', 'c', 'd']) // => [['a', 'b'], ['c', 'd']]
 *    P.chunk(3)(['a', 'b', 'c', 'd']) // => [['a', 'b', 'c'], ['d']]
 * @data_last
 * @category Array
 */
export function chunk<T extends IterableContainer>(
  size: number
): (array: T) => Chunked<T>;

export function chunk() {
  return purry(_chunk, arguments);
}

function _chunk<T>(array: ReadonlyArray<T>, size: number) {
  const ret: Array<ReadonlyArray<T>> = Array.from({
    length: Math.ceil(array.length / size),
  });
  for (let index = 0; index < ret.length; index += 1) {
    ret[index] = array.slice(index * size, (index + 1) * size);
  }
  return ret;
}
