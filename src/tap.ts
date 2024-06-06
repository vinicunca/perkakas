import { curry } from './curry';

/**
 * Calls the given function with the given value, then returns the given value.
 * The return value of the provided function is ignored.
 *
 * This allows "tapping into" a function sequence in a pipe, to perform side
 * effects on intermediate results.
 *
 * @param value - The value to pass into the function.
 * @param fn - The function to call.
 * @signature
 *    P.tap(value, fn)
 * @example
 *    P.tap("foo", console.log) // => "foo"
 * @dataFirst
 * @category Other
 */
export function tap<T>(value: T, fn: (value: T) => void): T;

/**
 * Calls the given function with the given value, then returns the given value.
 * The return value of the provided function is ignored.
 *
 * This allows "tapping into" a function sequence in a pipe, to perform side
 * effects on intermediate results.
 *
 * @param fn - The function to call.
 * @signature
 *    P.tap(fn)(value)
 * @example
 *    P.pipe(
 *      [-5, -1, 2, 3],
 *      P.filter(n => n > 0),
 *      P.tap(console.log), // prints [2, 3]
 *      P.map(n => n * 2)
 *    ) // => [4, 6]
 * @dataLast
 * @category Other
 */
export function tap<T, F extends (value: T) => unknown>(fn: F): (value: T) => T;

export function tap(...args: ReadonlyArray<unknown>): unknown {
  return curry(tapImplementation, args);
}

function tapImplementation<T>(value: T, fn: (value: T) => void): T {
  fn(value);
  return value;
}
