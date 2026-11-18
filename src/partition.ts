import type {
  ArrayCallback,
  ArrayTypePredicate,
} from './internal/types/callback';
import type { DataLastBuilder } from './internal/types/data-last-builder';
import type { FilteredArray } from './internal/types/filtered-array';
import type { IterableContainer } from './internal/types/iterable-container';
import type { NonRefinedFilteredArray } from './internal/types/non-refined-filtered-array';
import type { Not } from './internal/types/not';

/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param data - The items to split.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and `false`
 * to add the element to the other partition. A type-predicate can also be used
 * to narrow the result.
 * @returns A 2-tuple of arrays where the first array contains the elements that
 * passed the predicate, and the second array contains the elements that did
 * not. The items are in the same order as they were in the original array.
 * @signature
 *    partition(data, predicate)
 * @example
 *    partition(
 *      ['one', 'two', 'forty two'],
 *      x => x.length === 3,
 *    ); // => [['one', 'two'], ['forty two']]
 * @dataFirst
 * @category Array
 */
export function partition<T extends IterableContainer, Condition>(
  data: T,
  predicate: ArrayTypePredicate<T, Condition>,
): [
  FilteredArray<T, Condition>,
  FilteredArray<T, Condition, true>,
];

export function partition<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: ArrayCallback<T, IsItemIncluded>,
): [
  NonRefinedFilteredArray<T, IsItemIncluded>,
  NonRefinedFilteredArray<T, Not<IsItemIncluded>>,
];

/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and `false`
 * to add the element to the other partition. A type-predicate can also be used
 * to narrow the result.
 * @returns A 2-tuple of arrays where the first array contains the elements that
 * passed the predicate, and the second array contains the elements that did
 * not. The items are in the same order as they were in the original array.
 * @signature
 *    partition(predicate)(data)
 * @example
 *    pipe(
 *      ['one', 'two', 'forty two'],
 *      partition(x => x.length === 3),
 *    ); // => [['one', 'two'], ['forty two']]
 * @dataLast
 * @category Array
 */
export function partition<T extends IterableContainer, Condition>(
  predicate: ArrayTypePredicate<T, Condition>,
): (
  data: T,
) => [
  FilteredArray<T, Condition>,
  FilteredArray<T, Condition, true>,
];

export function partition<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: ArrayCallback<T, IsItemIncluded>,
): (
  data: T,
) => [
  NonRefinedFilteredArray<T, IsItemIncluded>,
  NonRefinedFilteredArray<T, Not<IsItemIncluded>>,
];

export function partition(
  dataOrPredicate:
    IterableContainer | ArrayCallback<IterableContainer, boolean>,
  predicate?: ArrayCallback<IterableContainer, boolean>,
): unknown {
  return typeof dataOrPredicate === 'function'
    // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
    ? dataLast(dataOrPredicate)
    : partitionImplementation(
        dataOrPredicate,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        predicate,
      );
}

const dataLast: DataLastBuilder<typeof partitionImplementation> =
  (predicate) => (data) =>
    partitionImplementation(data, predicate);

const partitionImplementation = <T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): [Array<T>, Array<T>] => {
  const ret: [Array<T>, Array<T>] = [[], []];
  data.forEach((item, index) => {
    if (predicate(item, index, data)) {
      ret[0].push(item);
    } else {
      ret[1].push(item);
    }
  });
  return ret;
}
