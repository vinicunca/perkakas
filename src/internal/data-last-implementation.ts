export type DataFirst<T, P extends ReadonlyArray<unknown>, R> = (
  data: T,
  ...args: P
) => R;

export type UnaryFunction<T = unknown, R = unknown> = (data: T) => R;

/**
 * Builds the data-last function for a `dataFirst` implementation.
 */
export function dataLastImplementation<T, P extends ReadonlyArray<unknown>, R>(dataFirst: DataFirst<T, P, R>, args: P): UnaryFunction<T, R> {
  return args.length === 1
    ? // Spreading `args` into the call goes through a generic builtin on every
      // invocation of the data-last function, so the most common data-last
      // arity, a single argument, is passed directly.
      (data) =>
        dataFirst(
          data,
          // @ts-expect-error [ts2345] -- TypeScript can't bind a runtime concern (`args.length === 1`) with the type for args. Even if we use our `hasAtLeast` it won't be able to couple the expected type with the actual one.
          args[0],
        )
    : (data) => dataFirst(data, ...args);
}
