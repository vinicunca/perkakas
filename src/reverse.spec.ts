import { assertType, describe, expect, it } from 'vitest';

import { pipe } from '../pipe';
import { reverse } from './reverse';

describe('data first', () => {
  it('reverse', () => {
    const actual = reverse([1, 2, 3]);
    expect(actual).toEqual([3, 2, 1]);
  });
  describe('reverse typings', () => {
    it('arrays', () => {
      const actual = reverse([1, 2, 3]);
      assertType<Array<number>>(actual);
    });
    it('tuples', () => {
      const actual = reverse([1, 2, [true], 'a'] as const);
      assertType<['a', readonly [true], 2, 1]>(actual);
    });

    it('variadic tuples', () => {
      const input: [number, ...Array<string>] = [1, 'two', 'three'];
      const actual = reverse(input);
      assertType<[...Array<string>, number]>(actual);
    });
  });
});

describe('data last', () => {
  it('reverse', () => {
    const actual = pipe([1, 2, 3], reverse());
    expect(actual).toEqual([3, 2, 1]);
  });
  describe('reverse typings', () => {
    it('arrays', () => {
      const actual = pipe([1, 2, 3], reverse());
      assertType<Array<number>>(actual);
    });
    it('tuples', () => {
      const actual = pipe([1, 2, [true], 'a'] as const, reverse());
      assertType<['a', readonly [true], 2, 1]>(actual);
    });

    it('variadic tuples', () => {
      const input: [number, ...Array<string>] = [1, 'two', 'three'];
      const actual = pipe(input, reverse());
      assertType<[...Array<string>, number]>(actual);
    });
  });
});
