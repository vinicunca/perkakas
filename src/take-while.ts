import type { StoppableLazyEvaluator } from './internal/make-stoppable';
import type { IterableContainer } from './internal/types/iterable-container';
import type {
  LazyCallback,
  LazyTypePredicate,
} from './internal/types/lazy-callback';
import type { NarrowedArray } from './internal/types/narrowed-array';
import type { NonRefinedFilteredArray } from './internal/types/non-refined-filtered-array';
import { curryWithLazy } from './internal/curry-with-lazy';
import { makeStoppable, STOP } from './internal/make-stoppable';
import { requireDataByArity } from './internal/require-data';

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param data - The array.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep taking elements, and `false` to stop. A
 * type-predicate can also be used to narrow the result.
 * @signature
 *    takeWhile(data, predicate)
 * @example
 *    takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function takeWhile<T extends IterableContainer, Condition>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => item is Condition,
): NarrowedArray<T, Condition>;

export function takeWhile<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: (item: T[number], index: number, data: T) => IsItemIncluded,
): NonRefinedFilteredArray<T, IsItemIncluded>;

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep taking elements, and `false` to stop. A
 * type-predicate can also be used to narrow the result.
 * @signature
 *    takeWhile(predicate)(data)
 * @example
 *    pipe([1, 2, 3, 4, 3, 2, 1], takeWhile(x => x !== 4))  // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function takeWhile<T extends IterableContainer, Condition>(
  predicate: LazyTypePredicate<T, Condition>,
): (data: T) => NarrowedArray<T, Condition>;

export function takeWhile<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: LazyCallback<T, IsItemIncluded>,
): (data: T) => NonRefinedFilteredArray<T, IsItemIncluded>;

export function takeWhile(...args: ReadonlyArray<unknown>): unknown {
  // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
  return curryWithLazy(takeWhileImplementation, 2, lazyImplementation, args);
}

function takeWhileImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T> {
  const ret: Array<T> = [];
  let index = 0;
  for (const item of data) {
    if (!predicate(item, index, data)) {
      break;
    }
    ret.push(item);
    index += 1;
  }
  return ret;
}

const lazyImplementation = makeStoppable(
  <T>(
    predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
  ): StoppableLazyEvaluator<T> =>
    requireDataByArity(predicate, 2, (item, index, data) =>
      predicate(item, index, data)
        ? item
        : STOP),
);
