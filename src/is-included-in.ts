import type { IterableContainer } from './_types';

/**
 * Checks if the item is included in the container. This is a wrapper around
 * `Array.prototype.includes` and `Set.prototype.has` and thus relies on the
 * same equality checks that those functions do (which is reference equality,
 * e.g. `===`). The input's type is narrowed to the container's type if
 * possible.
 *
 * Notice that unlike most functions, this function takes a generic item as it's
 * data and **an array** as it's parameter.
 *
 * @param data - The item that is checked.
 * @param container - The items that are checked against.
 * @returns A narrowed version of the input data on success, `false` otherwise.
 * @signature
 *  isIncludedIn(data, container);
 * @example
 *  import { isIncludedIn } from '@vinicunca/perkakas';
 *
 *  isIncludedIn(2, [1, 2, 3]); // => true
 *  isIncludedIn(4, [1, 2, 3]); // => false
 *
 *  const data = "cat" as "cat" | "dog" | "mouse";
 *  isIncludedIn(data, ["cat", "dog"] as const); // true (typed "cat" | "dog");
 * @dataFirst
 * @category Guard
 */
export function isIncludedIn<T, S extends T>(
  data: T,
  container: IterableContainer<S>,
): data is S;

/**
 * Checks if the item is included in the container. This is a wrapper around
 * `Array.prototype.includes` and `Set.prototype.has` and thus relies on the
 * same equality checks that those functions do (which is reference equality,
 * e.g. `===`). The input's type is narrowed to the container's type if
 * possible.
 *
 * Notice that unlike most functions, this function takes a generic item as it's
 * data and **an array** as it's parameter.
 *
 * @param container - The items that are checked against.
 * @returns A narrowed version of the input data on success, `false` otherwise.
 * @signature
 *  isIncludedIn(container)(data);
 * @example
 *  import { isIncludedIn, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(2, isIncludedIn([1, 2, 3])); // => true
 *  pipe(4, isIncludedIn([1, 2, 3])); // => false
 *
 *  const data = "cat" as "cat" | "dog" | "mouse";
 *  pipe(
 *    data,
 *    isIncludedIn(["cat", "dog"] as const),
 *  ); // => true (typed "cat" | "dog");
 * @dataLast
 * @category Guard
 */
export function isIncludedIn<T, S extends T>(
  container: IterableContainer<S>,
): (data: T) => data is S;

export function isIncludedIn(
  dataOrContainer: unknown,
  container?: ReadonlyArray<unknown>,
): unknown {
  if (container === undefined) {
    // === dataLast ===
    // We don't use purry here because we can optimize the dataLast case by
    // memoizing a set and accessing it in O(1) time instead of scanning the
    // array **each time** (O(n)) each time.
    const asSet = new Set(dataOrContainer as ReadonlyArray<unknown>);
    return (data: unknown) => asSet.has(data);
  }

  // === dataFirst ===
  return container.includes(dataOrContainer);
}
