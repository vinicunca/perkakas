import type { IsNumericLiteral } from 'type-fest';

import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import type { LazyResult } from './internal/types/lazy-result';

import { lazyDataLastImpl } from './internal/lazy-data-last-impl';
import { lazyIdentityEvaluator } from './internal/utility-evaluators';

type FlatArray<
  T,
  Depth extends number,
  Iteration extends ReadonlyArray<unknown> = [],
> = Depth extends Iteration['length']
  // Stopping condition for the recursion when the array is a tuple.
  ? T
  : T extends readonly []
    // Trivial result when the array is empty.
    ? []
    : T extends readonly [infer Item, ...infer Rest]
      // Tuples could be special-cased by "iterating" over each item
      // separately so that we maintain more information from the input type,
      // instead of putting all values in a union.
      ? [
          ...(Item extends IterableContainer
            // If the item itself is an array we continue going deeper
            ? FlatArray<Item, Depth, [...Iteration, unknown]>
            // But if it isn't we add it to the output tuple
            : [Item]),
          // And we merge this with the result from the rest of the tuple.
          ...FlatArray<Rest, Depth, Iteration>,
        ]
      // For simple arrays we compute the item type, and wrap it with an array.
      : Array<FlatSimpleArrayItems<T, Depth, Iteration>>;

// This type is based on the built-in type for `Array.prototype.flat` from the
// ES2019 Array typescript library, but we improved it to handle any depth
// (avoiding the fixed `20` in the built-in type).
// @see https://github.com/microsoft/TypeScript/blob/main/src/lib/es2019.array.d.ts#L1-L5
type FlatSimpleArrayItems<
  T,
  Depth extends number,
  Iteration extends ReadonlyArray<unknown> = [],
  IsDone extends boolean = false,
> = {
  done: T;
  recur: T extends ReadonlyArray<infer InnerArr>
    ? FlatSimpleArrayItems<
      InnerArr,
      Depth,
      [...Iteration, unknown],
      // This trick allows us to continue 1 iteration more than the depth,
      // which is required to flatten the array up to depth.
      Iteration['length'] extends Depth ? true : false
    >
    : T;
}[IsDone extends true ? 'done' : 'recur'];

/**
 * Creates a new array with all sub-array elements concatenated into it
 * recursively up to the specified depth. Equivalent to the built-in
 * `Array.prototype.flat` method.
 *
 * @param data - The items to flatten.
 * @param depth - The depth level specifying how deep a nested array structure
 * should be flattened. Defaults to 1. Non literal values (those typed as
 * `number`cannot be used. `Infinity`, `Number.POSITIVE_INFINITY` and
 * `Number.MAX_VALUE` are all typed as `number` and can't be used either. For
 * "unlimited" depth use a literal value that would exceed your expected
 * practical maximum nesting level.
 * @signature
 *   P.flat(data)
 *   P.flat(data, depth)
 * @example
 *   P.flat([[1, 2], [3, 4], [5], [[6]]]); // => [1, 2, 3, 4, 5, [6]]
 *   P.flat([[[1]], [[2]]], 2); // => [1, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function flat<
  T extends IterableContainer,
  Depth extends number = 1,
>(
  data: T,
  depth?: IsNumericLiteral<Depth> extends true ? Depth : never,
): FlatArray<T, Depth>;

/**
 * Creates a new array with all sub-array elements concatenated into it
 * recursively up to the specified depth. Equivalent to the built-in
 * `Array.prototype.flat` method.
 *
 * @param depth - The depth level specifying how deep a nested array structure
 * should be flattened. Defaults to 1.
 * @signature
 *   P.flat()(data)
 *   P.flat(depth)(data)
 * @example
 *   P.pipe([[1, 2], [3, 4], [5], [[6]]], P.flat()); // => [1, 2, 3, 4, 5, [6]]
 *   P.pipe([[[1]], [[2]]], P.flat(2)); // => [1, 2]
 * @dataLast
 * @lazy
 * @category Array
 */
export function flat<Depth extends number = 1>(
  depth?: IsNumericLiteral<Depth> extends true ? Depth : never,
): <T extends IterableContainer>(data: T) => FlatArray<T, Depth>;

export function flat(
  dataOrDepth?: IterableContainer | number,
  depth?: number,
): unknown {
  if (typeof dataOrDepth === 'object') {
    return flatImplementation(dataOrDepth, depth);
  }

  return lazyDataLastImpl(
    flatImplementation,
    dataOrDepth === undefined ? [] : [dataOrDepth],
    lazyImplementation,
  );
}

function flatImplementation(
  data: IterableContainer,
  depth?: number,
): IterableContainer {
  return (depth === undefined ? data.flat() : data.flat(depth));
};

function lazyImplementation(depth?: number): LazyEvaluator {
  if (depth === undefined || depth === 1) {
    return lazyShallow;
  }

  if (depth <= 0) {
    return lazyIdentityEvaluator;
  }

  return (value) =>
    Array.isArray(value)
      ? {
          next: value.flat(depth - 1),
          hasNext: true,
          hasMany: true,
          done: false,
        }
      : { next: value, hasNext: true, done: false }; ;
}

/**
 * This function is pulled out so that we don't generate a new function
 * each time. Because it doesn't need to run with recursion it could be pulled
 * out from the lazyImplementation and be reused for all invocations.
 */
function lazyShallow<T>(value: T): LazyResult<T> {
  return Array.isArray(value)
    ? { next: value, hasNext: true, hasMany: true, done: false }
    : { next: value, hasNext: true, done: false };
}
