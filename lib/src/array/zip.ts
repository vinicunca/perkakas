import { purry } from '../function';

/**
 * Creates a new list from two supplied lists by pairing up equally-positioned items.
 * The length of the returned list will match the shortest of the two inputs.
 * @param first the first input list
 * @param second the second input list
 * @signature
 *   P.zip(first, second)
 * @example
 *   P.zip([1, 2], ['a', 'b']) // => [1, 'a'], [2, 'b']
 * @dataFirst
 * @category Array
 */
export function zip<F, S>(
  first: ReadonlyArray<F>,
  second: ReadonlyArray<S>
): Array<[F, S]>;

/**
 * Creates a new list from two supplied lists by pairing up equally-positioned items.
 * The length of the returned list will match the shortest of the two inputs.
 * @param second the second input list
 * @signature
 *   P.zip(second)(first)
 * @example
 *   P.zip(['a', 'b'])([1, 2]) // => [[1, 'a'], [2, 'b']
 * @dataLast
 * @category Array
 */
export function zip<S>(
  second: ReadonlyArray<S>
): <F>(first: ReadonlyArray<F>) => Array<[F, S]>;

export function zip(...args: any[]) {
  return purry(_zip, args);
}

function _zip(first: Array<unknown>, second: Array<unknown>) {
  const resultLength
    = first.length > second.length ? second.length : first.length;
  const result = [];
  for (let i = 0; i < resultLength; i++) {
    result.push([first[i], second[i]]);
  }

  return result;
}
