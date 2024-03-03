import { purry } from '../function/purry';

/**
 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 * @param items the array to reduce
 * @param fn the callback function
 * @param initialValue the initial value to use as an accumulator value in the callback function
 * @signature
 *    P.reduce(items, fn, initialValue)
 *    P.reduce.indexed(items, fn, initialValue)
 * @example
 *    P.reduce([1, 2, 3, 4, 5], (acc, x) => acc + x, 100) // => 115
 *    P.reduce.indexed([1, 2, 3, 4, 5], (acc, x, i, array) => acc + x, 100) // => 115
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
 * @param fn the callback function
 * @param initialValue the initial value to use as an accumulator value in the callback function
 * @signature
 *    P.reduce(fn, initialValue)(array)
 * @example
 *    P.pipe([1, 2, 3, 4, 5], P.reduce((acc, x) => acc + x, 100)) // => 115
 *    P.pipe([1, 2, 3, 4, 5], P.reduce.indexed((acc, x, i, array) => acc + x, 100)) // => 115
 * @dataLast
 * @indexed
 * @category Array
 */
export function reduce<T, K>(
  fn: (acc: K, item: T) => K,
  initialValue: K
): (items: ReadonlyArray<T>) => K;

export function reduce(...args: any[]) {
  return purry(_reduce(false), args);
}

function _reduce(indexed: boolean) {
  return <T, K>(
    items: Array<T>,
    fn: (acc: K, item: T, index?: number, items?: Array<T>) => K,
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
    fn: (acc: K, item: T, index: number, items: Array<T>) => K,
    initialValue: K
  ): K;
  export function indexed<T, K>(
    fn: (acc: K, item: T, index: number, items: Array<T>) => K,
    initialValue: K
  ): (array: ReadonlyArray<T>) => K;
  export function indexed(...args: any[]) {
    return purry(_reduce(true), args);
  }
}
