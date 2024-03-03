import { describe, expect, it } from 'vitest';

import { pipe } from '../function/pipe';
import { pathOr } from './path-or';

interface SampleType {
  a: {
    b: {
      c: number;
      d?: number;
    };
    z?: number;
  };
  x?: number;
  y?: number;
}

const obj: SampleType = {
  a: {
    b: {
      c: 1,
    },
  },
  y: 10,
};

describe('data first', () => {
  it('should return default value (input undefined)', () => {
    type MaybeSampleType = SampleType | undefined;
    expect(pathOr(undefined as MaybeSampleType, ['x'], 2)).toEqual(2);
  });

  it('should return value', () => {
    expect(pathOr(obj, ['y'] as const, 2)).toEqual(10);
  });

  it('should return default value', () => {
    expect(pathOr(obj, ['x'] as const, 2)).toEqual(2);
  });

  it('should return value (2 level deep)', () => {
    expect(pathOr(obj, ['a', 'b'] as const, { c: 0 })).toEqual({ c: 1 });
  });

  it('should return default value (2 level deep)', () => {
    expect(pathOr(obj, ['a', 'z'] as const, 3)).toEqual(3);
  });

  it('should return value (3 level deep)', () => {
    expect(pathOr(obj, ['a', 'b', 'c'] as const, 0)).toEqual(1);
  });
});

describe('data last', () => {
  it('1 level', () => {
    expect(pipe(obj, pathOr(['x'], 1))).toEqual(1);
  });
  it('2 level', () => {
    expect(pipe(obj, pathOr(['a', 'z'], 1))).toEqual(1);
  });
  it('3 level', () => {
    expect(pipe(obj, pathOr(['a', 'b', 'd'] as const, 1))).toEqual(1);
  });
});
