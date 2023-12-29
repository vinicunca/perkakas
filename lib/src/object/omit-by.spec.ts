import { assertType, describe, expect, it } from 'vitest';

import { pipe } from '../function';
import { omitBy } from './omit-by';

describe('data first', () => {
  it('it should omit props', () => {
    const result = omitBy(
      { A: 3, B: 4, a: 1, b: 2 },
      (val, key) => key.toUpperCase() === key,
    );
    assertType<Record<'A' | 'B' | 'a' | 'b', number>>(result);
    expect(result).toStrictEqual({ a: 1, b: 2 });
  });
  it('allow partial type', () => {
    const result = omitBy(
      {} as Partial<{ a: string; b: number }>,
      (val, key) => key === 'a',
    );
    assertType<Partial<{ a: string; b: number }>>(result);
    expect(result).toEqual({});
  });
});

describe('data last', () => {
  it('it should omit props', () => {
    const result = pipe(
      { A: 3, B: 4, a: 1, b: 2 },
      omitBy((val, key) => key.toUpperCase() === key),
    );
    assertType<Record<'A' | 'B' | 'a' | 'b', number>>(result);
    expect(result).toStrictEqual({ a: 1, b: 2 });
  });
  it('allow partial type', () => {
    const result = pipe(
      {} as Partial<{ a: string; b: number }>,
      omitBy((val, key) => key.toUpperCase() === key),
    );
    assertType<Partial<{ a: string; b: number }>>(result);
    expect(result).toEqual({});
  });
});
