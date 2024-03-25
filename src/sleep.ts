/**
 * Delay execution for a given number of milliseconds.
 *
 * @param timeout the number of milliseconds to wait
 * @signature
 *   sleep(timeout)
 * @example
 *  sleep(1000) // => Promise<void>
 * @category Function
 */
export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
