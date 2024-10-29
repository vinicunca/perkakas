/**
 * A function that returns the first argument passed to it.
 *
 * Notice that this is a dataLast impl where the function needs to be invoked
 * to get the "do nothing" function.
 *
 * See also:
 * `doNothing` - A function that doesn't return anything.
 * `constant` - A function that ignores the input arguments and returns the same value on every invocation.
 *
 * @signature
 *    P.identity();
 * @example
 *    P.map([1,2,3], P.identity()); // => [1,2,3]
 * @category Function
 */
export function identity(): typeof identityImplementation {
  /**
   * Notice that the exported identity function is just the "factory" for the
   * function. We do it this way so that all "Function" utilities have a similar
   * API where the function is called, and not just used "headless". e.g.
   * `doNothing()` and not `doNothing`, just like the API for `constant(1)`.
   */
  return identityImplementation;
}

function identityImplementation<T, Args extends ReadonlyArray<unknown>>(
  value: T,
  // Ignore any extra arguments provided to the function call
  ..._args: Args
): T {
  return value;
};
