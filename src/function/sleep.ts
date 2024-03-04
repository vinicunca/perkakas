/**
 * Delay execution for a given number of milliseconds.
 *
 * @param timeout the number of milliseconds to wait
 * @signature
 *   P.sleep(timeout)
 * @example
 *  P.sleep(1000) // => Promise<void>
 * @category Function
 */
export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
