import { assertType, describe, expect, it } from 'vitest';

import type { NonEmptyArray } from '../utils/types';

import { pipe } from '../function/pipe';
import { last } from './last';

describe('last', () => {
  describe('data first', () => {
    it('should return last', () => {
      expect(last([1, 2, 3] as const)).toEqual(3);
    });

    it('empty array', () => {
      expect(last([] as const)).toEqual(undefined);
    });
  });

  describe('data last', () => {
    it('should return last', () => {
      expect(pipe([1, 2, 3] as const, last())).toEqual(3);
    });

    it('empty array', () => {
      expect(pipe([] as const, last())).toEqual(undefined);
    });
  });

  describe('types', () => {
    it('should return T | undefined for Array input', () => {
      const input: Array<number> = [1, 2, 3];
      const actual = last(input);
      assertType<number | undefined>(actual);
    });

    it('should not return undefined for non empty arrays', () => {
      const input: NonEmptyArray<number> = [1, 2, 3];
      const data = last(input);
      assertType<number>(data);
    });

    it('should infer type in pipes', () => {
      const data = pipe('this is a text', (data) => data.split(''), last());
      assertType<string | undefined>(data);
    });
  });
});
