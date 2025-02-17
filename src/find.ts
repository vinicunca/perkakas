import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curry } from './curry';
import { toSingle } from './internal/to-single';
import { SKIP_ITEM } from './internal/utility-evaluators';

/**
 * Returns the first element in the provided array that satisfies the provided
 * testing function. If no values satisfy the testing function, `undefined` is
 * returned.
 *
 * Similar functions:
 * `findLast` - If you need the last element that satisfies the provided testing function.
 * `findIndex` - If you need the index of the found element in the array.
 * `indexOf` - If you need to find the index of a value.
 * `includes` - If you need to find if a value exists in an array.
 * `some` - If you need to find if any element satisfies the provided testing function.
 * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The first element in the array that satisfies the provided testing
 * function. Otherwise, `undefined` is returned.
 * @signature
 *    P.find(data, predicate)
 * @example
 *    P.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 * @dataFirst
 * @lazy
 * @category Array
 */
export function find<T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): S | undefined;
export function find<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): T | undefined;

/**
 * Returns the first element in the provided array that satisfies the provided
 * testing function. If no values satisfy the testing function, `undefined` is
 * returned.
 *
 * Similar functions:
 * `findLast` - If you need the last element that satisfies the provided testing function.
 * `findIndex` - If you need the index of the found element in the array.
 * `indexOf` - If you need to find the index of a value.
 * `includes` - If you need to find if a value exists in an array.
 * `some` - If you need to find if any element satisfies the provided testing function.
 * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The first element in the array that satisfies the provided testing
 * function. Otherwise, `undefined` is returned.
 * @signature
 *    P.find(predicate)(data)
 * @example
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.find(n => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @lazy
 * @category Array
 */
export function find<T, S extends T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): (data: ReadonlyArray<T>) => S | undefined;
export function find<T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => T | undefined;

export function find(...args: ReadonlyArray<unknown>): unknown {
  return curry(findImplementation, args, toSingle(lazyImplementation));
}

function findImplementation<T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): S | undefined {
  return data.find(predicate);
}

function lazyImplementation<T, S extends T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): LazyEvaluator<T, S> {
  return (value, index, data) =>
    predicate(value, index, data)
      ? { done: true, hasNext: true, next: value }
      : SKIP_ITEM;
}
