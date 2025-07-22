import { describe, expectTypeOf, it } from 'vitest';
import { pipe } from './pipe';
import { zip } from './zip';

describe('dataFirst', () => {
  it('arrays', () => {
    const actual = zip([1, 2, 3], ['a', 'b', 'c']);

    expectTypeOf(actual).toEqualTypeOf<
      [[number, string], [number, string], [number, string]]
    >();
  });

  it('tuples', () => {
    const actual = zip(
      [1, 2, 3] as [1, 2, 3],
      ['a', 'b', 'c'] as ['a', 'b', 'c'],
    );

    expectTypeOf(actual).toEqualTypeOf<[[1, 'a'], [2, 'b'], [3, 'c']]>();
  });

  it('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = zip(firstVariadic, secondVariadic);

    expectTypeOf(actual).toEqualTypeOf<
      [[number, string], ...Array<[string, number]>]
    >();
  });

  it('on empty tuples', () => {
    const array: [] = [];
    const result = zip(array, array);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on empty readonly tuples', () => {
    const array: readonly [] = [];
    const result = zip(array, array);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on arrays', () => {
    const array: Array<number> = [];
    const result = zip(array, array);

    expectTypeOf(result).toEqualTypeOf<Array<[number, number]>>();
  });

  it('on mixed typeds array', () => {
    const array1: Array<number> = [];
    const array2: Array<string> = [];
    const result = zip(array1, array2);

    expectTypeOf(result).toEqualTypeOf<Array<[number, string]>>();
  });

  it('on readonly arrays', () => {
    const array: ReadonlyArray<number> = [];
    const result = zip(array, array);

    expectTypeOf(result).toEqualTypeOf<Array<[number, number]>>();
  });

  it('on tuples', () => {
    const array1: [1, 2, 3] = [1, 2, 3];
    const array2: [4, 5, 6] = [4, 5, 6];
    const result = zip(array1, array2);

    expectTypeOf(result).toEqualTypeOf<[[1, 4], [2, 5], [3, 6]]>();
  });

  it('on readonly tuples', () => {
    const array1: readonly [1, 2, 3] = [1, 2, 3];
    const array2: readonly [4, 5, 6] = [4, 5, 6];
    const result = zip(array1, array2);

    expectTypeOf(result).toEqualTypeOf<[[1, 4], [2, 5], [3, 6]]>();
  });

  it('on tuples of different lengths', () => {
    const array1: [1, 2, 3] = [1, 2, 3];
    const array2: [4, 5] = [4, 5];
    const result1 = zip(array1, array2);

    expectTypeOf(result1).toEqualTypeOf<[[1, 4], [2, 5]]>();
    const result2 = zip(array2, array1);

    expectTypeOf(result2).toEqualTypeOf<[[4, 1], [5, 2]]>();
  });

  it('on variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const result = zip(firstVariadic, secondVariadic);

    expectTypeOf(result).toEqualTypeOf<
      [[number, string], ...Array<[string, number]>]
    >();
  });
});

describe('dataLast', () => {
  it('arrays', () => {
    const actual = pipe([1, 2, 3], zip(['a', 'b', 'c']));

    expectTypeOf(actual).toEqualTypeOf<
      [[number, string], [number, string], [number, string]]
    >();
  });
  it('tuples', () => {
    const actual = pipe(
      [1, 2, 3] as [1, 2, 3],
      zip(['a', 'b', 'c'] as ['a', 'b', 'c']),
    );

    expectTypeOf(actual).toEqualTypeOf<[[1, 'a'], [2, 'b'], [3, 'c']]>();
  });
  it('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = pipe(firstVariadic, zip(secondVariadic));

    expectTypeOf(actual).toEqualTypeOf<
      [[number, string], ...Array<[string, number]>]
    >();
  });

  it('on empty tuples', () => {
    const array: [] = [];
    const result = pipe(array, zip(array));

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on empty readonly tuples', () => {
    const array: readonly [] = [];
    const result = pipe(array, zip(array));

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on arrays', () => {
    const array: Array<number> = [];
    const result = pipe(array, zip(array));

    expectTypeOf(result).toEqualTypeOf<Array<[number, number]>>();
  });

  it('on mixed typeds array', () => {
    const array1: Array<number> = [];
    const array2: Array<string> = [];
    const result = pipe(array1, zip(array2));

    expectTypeOf(result).toEqualTypeOf<Array<[number, string]>>();
  });

  it('on readonly arrays', () => {
    const array: ReadonlyArray<number> = [];
    const result = pipe(array, zip(array));

    expectTypeOf(result).toEqualTypeOf<Array<[number, number]>>();
  });

  it('on tuples', () => {
    const array1: [1, 2, 3] = [1, 2, 3];
    const array2: [4, 5, 6] = [4, 5, 6];
    const result = pipe(array1, zip(array2));

    expectTypeOf(result).toEqualTypeOf<[[1, 4], [2, 5], [3, 6]]>();
  });

  it('on readonly tuples', () => {
    const array1: readonly [1, 2, 3] = [1, 2, 3];
    const array2: readonly [4, 5, 6] = [4, 5, 6];
    const result = pipe(array1, zip(array2));

    expectTypeOf(result).toEqualTypeOf<[[1, 4], [2, 5], [3, 6]]>();
  });

  it('on tuples of different lengths', () => {
    const array1: [1, 2, 3] = [1, 2, 3];
    const array2: [4, 5] = [4, 5];
    const result1 = pipe(array1, zip(array2));

    expectTypeOf(result1).toEqualTypeOf<[[1, 4], [2, 5]]>();
    const result2 = pipe(array2, zip(array1));

    expectTypeOf(result2).toEqualTypeOf<[[4, 1], [5, 2]]>();
  });

  it('on variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const result = pipe(firstVariadic, zip(secondVariadic));

    expectTypeOf(result).toEqualTypeOf<
      [[number, string], ...Array<[string, number]>]
    >();
  });
});
