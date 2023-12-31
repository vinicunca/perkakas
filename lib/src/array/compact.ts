import { isTruthy } from '../guard';

/**
 * Filter out all falsey values. The values `false`, `null`, `0`, `""`, `undefined`, and `NaN` are falsey.
 * @param items the array to compact
 * @signature
 *    P.compact(array)
 * @example
 *    P.compact([0, 1, false, 2, '', 3]) // => [1, 2, 3]
 * @category Array
 * @pipeable
 */
export function compact<T>(
  items: ReadonlyArray<'' | 0 | T | false | null | undefined>,
): Array<T> {
  // TODO: Make lazy version
  return items.filter(isTruthy);
}
