import { assertType, describe, expect, expectTypeOf, it } from 'vitest';

import { pipe } from '../function';
import { zip } from './zip';

const first = [1, 2, 3];
const second = ['a', 'b', 'c'];
const shorterFirst = [1, 2];
const shorterSecond = ['a', 'b'];

describe('data first', () => {
  it('should zip', () => {
    expect(zip(first, second)).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });
  it('should truncate to shorter second', () => {
    expect(zip(first, shorterSecond)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
  it('should truncate to shorter first', () => {
    expect(zip(shorterFirst, second)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
});

describe('data first typings', () => {
  it('arrays', () => {
    const actual = zip(first, second);
    assertType<Array<[number, string]>>(actual);
  });
  it('tuples', () => {
    const actual = zip(first as [1, 2, 3], second as ['a', 'b', 'c']);
    assertType<Array<[1 | 2 | 3, 'a' | 'b' | 'c']>>(actual);
  });
  it('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = zip(firstVariadic, secondVariadic);
    assertType<Array<[number | string, number | string]>>(actual);
  });
});

describe('data last', () => {
  it('should zip', () => {
    expect(zip(second)(first)).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });
  it('should truncate to shorter second', () => {
    expect(zip(shorterSecond)(first)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
  it('should truncate to shorter first', () => {
    expect(zip(second)(shorterFirst)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
});

describe('data last typings', () => {
  it('arrays', () => {
    const actual = pipe(first, zip(second));
    assertType<Array<[number, string]>>(actual);
  });
  it('tuples', () => {
    const actual = pipe(first as [1, 2, 3], zip(second as ['a', 'b', 'c']));
    assertType<Array<[1 | 2 | 3, 'a' | 'b' | 'c']>>(actual);
  });
  it('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = pipe(firstVariadic, zip(secondVariadic));
    assertType<Array<[number | string, number | string]>>(actual);
  });
});

describe('strict dataFirst typings', () => {
  it('on empty tuples', () => {
    const array: [] = [];
    const result = zip.strict(array, array);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on empty readonly tuples', () => {
    const array: readonly [] = [];
    const result = zip.strict(array, array);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on arrays', () => {
    const array: Array<number> = [];
    const result = zip.strict(array, array);
    expectTypeOf(result).toEqualTypeOf<Array<[number, number]>>();
  });

  it('on mixed typeds array', () => {
    const array1: Array<number> = [];
    const array2: Array<string> = [];
    const result = zip.strict(array1, array2);
    expectTypeOf(result).toEqualTypeOf<Array<[number, string]>>();
  });

  it('on readonly arrays', () => {
    const array: ReadonlyArray<number> = [];
    const result = zip.strict(array, array);
    expectTypeOf(result).toEqualTypeOf<Array<[number, number]>>();
  });

  it('on tuples', () => {
    const array1: [1, 2, 3] = [1, 2, 3];
    const array2: [4, 5, 6] = [4, 5, 6];
    const result = zip.strict(array1, array2);
    expectTypeOf(result).toEqualTypeOf<[[1, 4], [2, 5], [3, 6]]>();
  });

  it('on readonly tuples', () => {
    const array1: readonly [1, 2, 3] = [1, 2, 3];
    const array2: readonly [4, 5, 6] = [4, 5, 6];
    const result = zip.strict(array1, array2);
    expectTypeOf(result).toEqualTypeOf<[[1, 4], [2, 5], [3, 6]]>();
  });

  it('on tuples of different lengths', () => {
    const array1: [1, 2, 3] = [1, 2, 3];
    const array2: [4, 5] = [4, 5];
    const result1 = zip.strict(array1, array2);
    expectTypeOf(result1).toEqualTypeOf<[[1, 4], [2, 5]]>();
    const result2 = zip.strict(array2, array1);
    expectTypeOf(result2).toEqualTypeOf<[[4, 1], [5, 2]]>();
  });

  it('on variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const result = zip.strict(firstVariadic, secondVariadic);
    expectTypeOf(result).toEqualTypeOf<
      [[number, string], ...Array<[string, number]>]
    >;
  });
});

describe('strict dataLast typings', () => {
  it('on empty tuples', () => {
    const array: [] = [];
    const result = pipe(array, zip.strict(array));
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on empty readonly tuples', () => {
    const array: readonly [] = [];
    const result = pipe(array, zip.strict(array));
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on arrays', () => {
    const array: Array<number> = [];
    const result = pipe(array, zip.strict(array));
    expectTypeOf(result).toEqualTypeOf<Array<[number, number]>>();
  });

  it('on mixed typeds array', () => {
    const array1: Array<number> = [];
    const array2: Array<string> = [];
    const result = pipe(array1, zip.strict(array2));
    expectTypeOf(result).toEqualTypeOf<Array<[number, string]>>();
  });

  it('on readonly arrays', () => {
    const array: ReadonlyArray<number> = [];
    const result = pipe(array, zip.strict(array));
    expectTypeOf(result).toEqualTypeOf<Array<[number, number]>>();
  });

  it('on tuples', () => {
    const array1: [1, 2, 3] = [1, 2, 3];
    const array2: [4, 5, 6] = [4, 5, 6];
    const result = pipe(array1, zip.strict(array2));
    expectTypeOf(result).toEqualTypeOf<[[1, 4], [2, 5], [3, 6]]>();
  });

  it('on readonly tuples', () => {
    const array1: readonly [1, 2, 3] = [1, 2, 3];
    const array2: readonly [4, 5, 6] = [4, 5, 6];
    const result = pipe(array1, zip.strict(array2));
    expectTypeOf(result).toEqualTypeOf<[[1, 4], [2, 5], [3, 6]]>();
  });

  it('on tuples of different lengths', () => {
    const array1: [1, 2, 3] = [1, 2, 3];
    const array2: [4, 5] = [4, 5];
    const result1 = pipe(array1, zip.strict(array2));
    expectTypeOf(result1).toEqualTypeOf<[[1, 4], [2, 5]]>();
    const result2 = pipe(array2, zip.strict(array1));
    expectTypeOf(result2).toEqualTypeOf<[[4, 1], [5, 2]]>();
  });

  it('on variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const result = pipe(firstVariadic, zip.strict(secondVariadic));
    expectTypeOf(result).toEqualTypeOf<
      [[number, string], ...Array<[string, number]>]
    >;
  });
});
