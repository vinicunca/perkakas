import { heapify, heapMaybeInsert } from './internal/heap';
import { SKIP_ITEM } from './internal/lazy-control';
import { withLazyImplementation } from './internal/lazy-data-last-implementation';
import {
  orderRuleComparer,
  type OrderRule,
  type OrderRules,
} from './internal/curry-order-rules';
import type { CompareFunction } from './internal/types/compare-function';
import type { DataLastBuilder } from './internal/types/data-last-builder';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';

/**
 * Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeFirstBy`.
 *
 * @param data - The input array.
 * @param n - The number of items to drop, rounded down. If `n` is less than 1 (or `NaN`) no items are dropped and a *clone* of the input is returned; if `n` is at least `data.length` no items are returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   dropFirstBy(data, n, ...rules);
 * @example
 *   dropFirstBy(['aa', 'aaaa', 'a', 'aaa'], 2, x => x.length); // => ['aaaa', 'aaa']
 * @dataFirst
 * @lazy
 * @category Array
 */
export function dropFirstBy<T>(
  data: ReadonlyArray<T>,
  n: number,
  ...rules: OrderRules<T>
): Array<T>;

/**
 * Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeFirstBy`.
 *
 * @param n - The number of items to drop, rounded down. If `n` is less than 1 (or `NaN`) no items are dropped and a *clone* of the input is returned; if `n` is at least `data.length` no items are returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   dropFirstBy(n, ...rules)(data);
 * @example
 *   pipe(['aa', 'aaaa', 'a', 'aaa'], dropFirstBy(2, x => x.length)); // => ['aaaa', 'aaa']
 * @dataLast
 * @lazy
 * @category Array
 */
export function dropFirstBy<T>(
  n: number,
  ...rules: OrderRules<NoInfer<T>>
): (data: ReadonlyArray<T>) => Array<T>;

export function dropFirstBy(
  dataOrN: ReadonlyArray<unknown> | number,
  nOrRule: number | OrderRule,
  ...rules: ReadonlyArray<OrderRule>
): unknown {
  if (typeof dataOrN === 'number') {
    // `compareFn` is stateless, so every run of the data-last function can
    // share the one built here.
    const compareFn = orderRuleComparer(
      // @ts-expect-error [ts2345] -- The function signatures ensure this is an `OrderRule`
      nOrRule,
      ...rules,
    );
    return withLazyImplementation(
      // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
      dataLast(compareFn, dataOrN),
      lazyImplementation,
      [compareFn, dataOrN],
    );
  }

  return dropFirstByImplementation(
    dataOrN,
    orderRuleComparer(
      // @ts-expect-error [ts2556] -- The function signatures ensure this is a non-empty array of `OrderRule`s
      ...rules,
    ),
    // @ts-expect-error [ts2345] -- The function signatures ensure this is a `number`
    nOrRule,
  );
}

const dataLast: DataLastBuilder<typeof dropFirstByImplementation> =
  (compareFn, n) => (data) =>
    dropFirstByImplementation(data, compareFn, n);

function dropFirstByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  n: number,
): Array<T> {
  if (n >= data.length) {
    return [];
  }

  if (n <= 0) {
    return data.concat();
  }

  const heap = data.slice(0, n);
  heapify(heap, compareFn);

  const out = [];

  for (let index = heap.length; index < data.length; index += 1) {
    out.push(heapMaybeInsert(heap, compareFn, data[index]!));
  }

  return out;
}

function lazyImplementation<T>([compareFn, n]: readonly [
  compareFn: CompareFunction<T>,
  n: number,
]): LazyEvaluator<T> {
  if (Number.isNaN(n) || n < 1) {
    // Trivially dropping nothing...
    return (item) => item;
  }

  const heapSize = Math.floor(n);
  const heap: Array<T> = [];
  return (item, index) => {
    if (index < heapSize) {
      heap.push(item);
      return SKIP_ITEM;
    }

    if (index === heapSize) {
      heapify(heap, compareFn);
    }

    return heapMaybeInsert(heap, compareFn, item);
  };
}
