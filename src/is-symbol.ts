import type { NarrowedTo } from './internal/types/narrowed-to';

/**
 * A function that checks if the passed parameter is a symbol and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a symbol, false otherwise.
 * @signature
 *    P.isSymbol(data)
 * @example
 *    P.isSymbol(Symbol('foo')) //=> true
 *    P.isSymbol(1) //=> false
 * @category Guard
 */
export function isSymbol<T>(data: symbol | T): data is NarrowedTo<T, symbol> {
  return typeof data === 'symbol';
}
