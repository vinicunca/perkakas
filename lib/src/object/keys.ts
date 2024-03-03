import type { IterableContainer } from '../utils/types';

/**
 * Returns a new array containing the keys of the array or object.
 * @param source Either an array or an object
 * @signature
 *    P.keys(source)
 *    P.keys.strict(source)
 * @example
 *    P.keys(['x', 'y', 'z']) // => ['0', '1', '2']
 *    P.keys({ a: 'x', b: 'y', c: 'z' }) // => ['a', 'b', 'c']
 *    P.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      P.keys,
 *      P.first
 *    ) // => 'a'
 *    P.keys.strict({ a: 'x', b: 'y', 5: 'z' } as const ) // => ['a', 'b', '5'], typed Array<'a' | 'b' | '5'>
 * @pipeable
 * @strict
 * @category Object
 */
export function keys(
  source: ArrayLike<unknown> | Record<PropertyKey, unknown>,
): Array<string> {
  return Object.keys(source);
}

type Strict = <T extends object>(source: T) => Keys<T>;
type Keys<T> = T extends IterableContainer ? ArrayKeys<T> : ObjectKeys<T>;

// The keys output can mirror the input when it is an array/tuple. We do this by
// "mapping" each item "key" (which is actually an index) as its own value. This
// would maintain the shape, even including labels.
type ArrayKeys<T extends IterableContainer> = {
  -readonly [Index in keyof T]: Index extends number | string
    ? // Notice that we coalesce the values as strings, this is because in JS,
      // Object.keys always returns strings, even for arrays.
      `${IsIndexAfterSpread<T, Index> extends true ? number : Index}`
    : // Index is typed as a symbol, this can't happen, but we need to guard
  // against it for typescript.
    never;
};

type IsIndexAfterSpread<
  T extends IterableContainer,
  Index extends number | string,
> = IndicesAfterSpread<T> extends never
  ? false
  : Index extends `${IndicesAfterSpread<T>}`
    ? true
    : false;

// Find the index of the tuple where a spread item is located, and return all
// indices in the tuple which are located after it. The tuple could be prefixed
// by any number of literal items. If the input is a simple array it would
// return 0 (as expected), and if the tuple doesn't contain a spread element it
// would return never.
type IndicesAfterSpread<
  T extends [] | ReadonlyArray<unknown>,
  // We use this type to count how many items we consumed, it's just a pseudo-
  // element that is used for its length.
  Iterations extends ReadonlyArray<unknown> = [],
> = T[number] extends never
  ? never
  : T extends readonly [unknown, ...infer Tail]
    ? IndicesAfterSpread<Tail, [unknown, ...Iterations]>
    : T extends readonly [...infer Head, unknown]
      ?
    IndicesAfterSpread<Head, [unknown, ...Iterations]>
    | Iterations['length']
      : Iterations['length'];

type ObjectKeys<T> = T extends Record<PropertyKey, never>
  ? []
  : Array<`${Exclude<keyof T, symbol>}`>;
export namespace keys {
  // @ts-expect-error [ts2322] - I don't know why i'm getting this, the typing
  // should be fine here because Key<T> returns a narrower type of string...
  export const strict: Strict = keys;
}
