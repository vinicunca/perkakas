/**
 * Utility for currying functions based on a predicate for the first argument.
 *
 * This is useful for currying functions with an optional parameter or a
 * variadic argument list.
 */
export function curryOn<T>(
  isArg: (firstArg: unknown) => firstArg is T,
  // We use `never` for the params to allow **any** function to match, this
  // works because all functions extend this shape, using `unknown` would
  // produce the opposite effect. This is better than using `any` which simply
  // avoids addressing the typing issue.
  implementation: (data: never, firstArg: T, ...args: never) => unknown,
  args: ReadonlyArray<unknown>,
): unknown {
  return isArg(args[0])
    ? // @ts-expect-error [ts2556] - This is a low-level function that assumes the function declaration and setup is correct and won't result in typing issues when called dynamically.
      (data: unknown) => implementation(data, ...args)
    : // @ts-expect-error [ts2556] - This is a low-level function that assumes the function declaration and setup is correct and won't result in typing issues when called dynamically.
      implementation(...args);
}
