import { assertType, describe, expect, it } from 'vitest';

import { pipe } from '../function';
import { pickBy } from './pick-by';

describe('data first', () => {
  it('it should pick props', () => {
    const result = pickBy(
      { A: 3, B: 4, a: 1, b: 2 },
      (val, key) => key.toUpperCase() === key,
    );
    assertType<Record<'A' | 'B' | 'a' | 'b', number>>(result);
    expect(result).toStrictEqual({ A: 3, B: 4 });
  });
  it('allow undefined or null', () => {
    expect(pickBy(undefined as any, (val, key) => key === 'foo')).toEqual({});
    expect(pickBy(null as any, (val, key) => key === 'foo')).toEqual({});
  });
  it('allow partial type', () => {
    const result = pickBy(
      {} as { a?: string; b?: number },
      (val, key) => key === 'a',
    );
    assertType<Partial<{ a: string; b: number }>>(result);
    expect(result).toEqual({});
  });
});

describe('data last', () => {
  it('it should pick props', () => {
    const result = pipe(
      { A: 3, B: 4, a: 1, b: 2 },
      pickBy((val, key) => key.toUpperCase() === key),
    );
    assertType<Record<'A' | 'B' | 'a' | 'b', number>>(result);
    expect(result).toStrictEqual({ A: 3, B: 4 });
  });
  it('allow partial type', () => {
    const result = pipe(
      {} as { a?: string; b?: number },
      pickBy((val, key) => key.toUpperCase() === key),
    );
    assertType<Partial<{ a: string; b: number }>>(result);
    expect(result).toEqual({});
  });
});
