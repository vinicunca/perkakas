import { purry } from './purry';

/**
 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 *
 * @param items the array to reduce
 * @param fn the callback function
 * @param initialValue the initial value to use as an accumulator value in the callback function
 * @signature
 *  reduce(items, fn, initialValue)
 *  reduce.indexed(items, fn, initialValue)
 * @example
 *  import { reduce } from '@vinicunca/perkakas';
 *
 *  reduce([1, 2, 3, 4, 5], (acc, x) => acc + x, 100); // => 115
 *  reduce.indexed([1, 2, 3, 4, 5], (acc, x, i, array) => acc + x, 100); // => 115
 * @dataFirst
 * @indexed
 * @category Array
 */
export function reduce<T, K>(
  items: ReadonlyArray<T>,
  fn: (acc: K, item: T) => K,
  initialValue: K
): K;

/**
 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 *
 * @param fn the callback function
 * @param initialValue the initial value to use as an accumulator value in the callback function
 * @signature
 *  reduce(fn, initialValue)(array)
 * @example
 *  import { reduce, pipe } from '@vinicunca/perkakas';
 *
 *  pipe([1, 2, 3, 4, 5], reduce((acc, x) => acc + x, 100)); // => 115
 *  pipe([1, 2, 3, 4, 5], reduce.indexed((acc, x, i, array) => acc + x, 100)); // => 115
 * @dataLast
 * @indexed
 * @category Array
 */
export function reduce<T, K>(
  fn: (acc: K, item: T) => K,
  initialValue: K
): (items: ReadonlyArray<T>) => K;

export function reduce(...args: Array<any>): unknown {
  return purry(reduce_(false), args);
}

function reduce_(indexed: boolean) {
  return <T, K>(
    items: ReadonlyArray<T>,
    fn: (acc: K, item: T, index?: number, items?: ReadonlyArray<T>) => K,
    initialValue: K,
  ): K => {
    return items.reduce(
      (acc, item, index) => indexed ? fn(acc, item, index, items) : fn(acc, item),
      initialValue,
    );
  };
}

export namespace reduce {
  export function indexed<T, K>(
    array: ReadonlyArray<T>,
    fn: (acc: K, item: T, index: number, items: ReadonlyArray<T>) => K,
    initialValue: K
  ): K;
  export function indexed<T, K>(
    fn: (acc: K, item: T, index: number, items: ReadonlyArray<T>) => K,
    initialValue: K
  ): (array: ReadonlyArray<T>) => K;
  export function indexed(...args: Array<any>): unknown {
    return purry(reduce_(true), args);
  }
}
