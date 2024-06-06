/**
 * Utility for currying functions based on a predicate for the first argument.
 *
 * This is useful for currying functions with a variadic argument list.
 */
export function curryOn<T>(
  isArg: (firstArg: unknown) => firstArg is T,
  implementation: (
    data: unknown,
    firstArg: T,
    // eslint-disable-next-line ts/no-explicit-any -- Function inference in typescript relies on `any` to work, it doesn't work with `unknown`
    ...args: any
  ) => unknown,
  args: ReadonlyArray<unknown>,
): unknown {
  return isArg(args[0])
    // @ts-expect-error [ts2556] - This is a low-level function that assumes the function declaration and setup is correct and won't result in typing issues when called dynamically.
    ? (data: unknown) => implementation(data, ...args)
    // @ts-expect-error [ts2556] - This is a low-level function that assumes the function declaration and setup is correct and won't result in typing issues when called dynamically.
    : implementation(...args);
}
