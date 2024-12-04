import type { NarrowedTo } from './internal/types/narrowed-to';

/**
 * A function that checks if the passed parameter is a bigint and narrows its
 * type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a number, false otherwise.
 * @signature
 *    P.isBigInt(data)
 * @example
 *    P.isBigInt(1n); // => true
 *    P.isBigInt(1); // => false
 *    P.isBigInt('notANumber'); // => false
 * @category Guard
 */
export function isBigInt<T>(data: bigint | T): data is NarrowedTo<T, bigint> {
  return typeof data === 'bigint';
}
