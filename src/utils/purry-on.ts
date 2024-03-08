/**
 * Utility for purrying functions based on a predicate for the first argument.
 *
 * This is useful for purrying functions with a variadic argument list.
 */
export function purryOn<T>(
  isArg: (firstArg: unknown) => firstArg is T,
  implementation: (
    data: unknown,
    firstArg: T,
    ...args: any
  ) => unknown,
  args: IArguments,
): unknown {
  const callArgs = Array.from(args) as ReadonlyArray<unknown>;
  return isArg(args[0])
    // @ts-expect-error [ts2556] - This is a low-level function that assumes the function declaration and setup is correct and won't result in typing issues when called dynamically.
    ? (data: unknown) => implementation(data, ...callArgs)
    // @ts-expect-error [ts2556] - This is a low-level function that assumes the function declaration and setup is correct and won't result in typing issues when called dynamically.
    : implementation(...callArgs);
}
