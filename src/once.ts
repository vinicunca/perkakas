/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls to the function return the value of the first invocation.
 * @param fn the function to wrap
 * @signature once(fn)
 * @example
 * const initialize = once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 * @category Function
 */
export function once<T>(fn: () => T): () => T {
  let called = false;
  let ret: T;
  return () => {
    if (!called) {
      ret = fn();
      called = true;
    }
    return ret;
  };
}
