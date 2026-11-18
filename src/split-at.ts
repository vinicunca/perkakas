import { curry2 } from './internal/curry-by-arity';

/**
 * Splits a given array at a given index.
 *
 * @param data - The array to split.
 * @param index - The index to split at.
 * @signature
 *    splitAt(data, index)
 * @example
 *    splitAt([1, 2, 3], 1) // => [[1], [2, 3]]
 *    splitAt([1, 2, 3, 4, 5], -1) // => [[1, 2, 3, 4], [5]]
 * @dataFirst
 * @category Array
 */
export function splitAt<T>(data: ReadonlyArray<T>, index: number): [Array<T>, Array<T>];

/**
 * Splits a given array at a given index.
 *
 * @param index - The index to split at.
 * @signature
 *    splitAt(index)(data)
 * @example
 *    splitAt(1)([1, 2, 3]) // => [[1], [2, 3]]
 *    splitAt(-1)([1, 2, 3, 4, 5]) // => [[1, 2, 3, 4], [5]]
 * @dataLast
 * @category Array
 */
export function splitAt<T>(index: number): (data: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function splitAt(
  dataOrIndex: ReadonlyArray<unknown> | number,
  index?: number,
): unknown {
  return curry2(splitAtImplementation, arguments.length, dataOrIndex, index);
}

function splitAtImplementation<T>(
  data: ReadonlyArray<T>,
  index: number,
): [Array<T>, Array<T>] {
  const effectiveIndex = Math.max(
    Math.min(index < 0
      ? data.length + index
      : index, data.length),
    0,
  );
  return [
    data.slice(0, effectiveIndex),
    data.slice(effectiveIndex),
  ];
}
