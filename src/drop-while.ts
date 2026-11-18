import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyCallback } from './internal/types/lazy-callback';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curryWithLazy } from './internal/curry-with-lazy';
import { SKIP_ITEM } from './internal/lazy-control';
import { requireDataByArity } from './internal/require-data';

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    dropWhile(data, predicate)
 * @example
 *    dropWhile([1, 2, 10, 3, 4], x => x < 10) // => [10, 3, 4]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function dropWhile<T extends IterableContainer>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => boolean,
): Array<T[number]>;

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    dropWhile(predicate)(data)
 * @example
 *    pipe([1, 2, 10, 3, 4], dropWhile(x => x < 10))  // => [10, 3, 4]
 * @dataLast
 * @lazy
 * @category Array
 */
export function dropWhile<T extends IterableContainer>(
  predicate: LazyCallback<T, boolean>,
): (data: T) => Array<T[number]>;

export function dropWhile(...args: ReadonlyArray<unknown>): unknown {
  return curryWithLazy(dropWhileImplementation, args, lazyImplementation);
}

function dropWhileImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T> {
  for (const [index, item] of data.entries()) {
    if (!predicate(item, index, data)) {
      return data.slice(index);
    }
  }
  return [];
}

function lazyImplementation<T>(
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): LazyEvaluator<T> {
  let isDropping = true;
  return requireDataByArity(predicate, (item, index, data) => {
    if (isDropping && predicate(item, index, data)) {
      return SKIP_ITEM;
    }

    isDropping = false;
    return item;
  });
}
