import type { NarrowedTo } from '../utils/types';

/**
 * A function that checks if the passed parameter is a symbol and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    P.isSymbol(data)
 * @returns true if the passed input is a symbol, false otherwise
 * @example
 *    P.isSymbol(Symbol('foo')) //=> true
 *    P.isSymbol(1) //=> false
 * @category Guard
 */
export function isSymbol<T>(data: T | symbol): data is NarrowedTo<T, symbol> {
  return typeof data === 'symbol';
}
