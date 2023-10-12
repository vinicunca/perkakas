import { assertType, describe, expect, it } from 'vitest';
import { pipe } from '../function';
import { omitBy } from './omit-by';

describe('data first', () => {
  it('it should omit props', () => {
    const result = omitBy(
      { a: 1, b: 2, A: 3, B: 4 },
      (val, key) => key.toUpperCase() === key,
    );
    assertType<Record<'a' | 'b' | 'A' | 'B', number>>(result);
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
      { a: 1, b: 2, A: 3, B: 4 },
      omitBy((val, key) => key.toUpperCase() === key),
    );
    assertType<Record<'a' | 'b' | 'A' | 'B', number>>(result);
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
