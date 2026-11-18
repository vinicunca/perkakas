import { describe, expect, it } from 'vitest';
import { constant } from './constant';
import { join } from './join';
import { pipe } from './pipe';

describe('joins same-typed items', () => {
  it('number', () => {
    const array = [1, 2, 3, 4, 5];
    const result = join(array, ',');

    expect(result).toBe('1,2,3,4,5');
  });

  it('string', () => {
    const array = ['a', 'b', 'c', 'd', 'e'];
    const result = join(array, ',');

    expect(result).toBe('a,b,c,d,e');
  });

  it('bigint', () => {
    const array = [1n, 2n, 3n, 4n, 5n];
    const result = join(array, ',');

    expect(result).toBe('1,2,3,4,5');
  });

  it('boolean', () => {
    const array = [true, false, true, false, true];
    const result = join(array, ',');

    expect(result).toBe('true,false,true,false,true');
  });

  it('null', () => {
    const array = [null, null, null, null, null];
    const result = join(array, ',');

    expect(result).toBe(',,,,');
  });

  it('undefined', () => {
    const array = [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ];
    const result = join(array, ',');

    expect(result).toBe(',,,,');
  });
});

it('joins different-typed items', () => {
  const array = [1, '2', 3n, true, null, undefined];
  const result = join(array, ',');

  expect(result).toBe('1,2,3,true,,');
});

describe('edge-cases', () => {
  it('empty glue', () => {
    const array = [1, 2, 3, 4, 5];
    const result = join(array, '');

    expect(result).toBe('12345');
  });

  it('empty array', () => {
    const array: Array<number> = [];
    const result = join(array, ',');

    expect(result).toBe('');
  });

  it('doesnt add glue on single item', () => {
    const array = [1];
    const result = join(array, ',');

    expect(result).toBe('1');
  });

  it('nested arrays join their own items with commas', () => {
    expect(join([
      1,
      // @ts-expect-error [ts2322] -- The nested array is the input under test.
      [
        2,
        [3, null],
      ],
    ], '-')).toBe('1-2,3,');
  });

  it('objects convert with the string hint', () => {
    expect(
      join([
        'a',
        // @ts-expect-error [ts2322] -- The object is the input under test.
        {
          toString: constant('b'),
          valueOf: constant('c'),
        },
      ], '-'),
    ).toBe('a-b');
  });

  it('a self-referencing array joins as empty', () => {
    const array: Array<unknown> = [1];
    array.push(array);

    // @ts-expect-error [ts2345] -- The array is the input under test.
    expect(join(array, '-')).toBe('1-');
  });

  it('a symbol item throws', () => {
    expect(() => join([
      // @ts-expect-error [ts2322] -- The symbol is the input under test.
      Symbol('a'),
    ], '-')).toThrow(
      new TypeError('Cannot convert a Symbol value to a string'),
    );
  });
});

describe('data last', () => {
  it('joins items', () => {
    expect(pipe([1, 2, 3], join(','))).toBe('1,2,3');
  });

  it('empty array', () => {
    expect(pipe([], join(','))).toBe('');
  });

  it('a symbol item throws', () => {
    expect(() => pipe([
      // @ts-expect-error [ts2322] -- The symbol is the input under test.
      Symbol('a'),
    ], join(','))).toThrow(
      new TypeError('Cannot convert a Symbol value to a string'),
    );
  });
});
