import { describe, expect, expectTypeOf, it } from 'vitest';
import { pipe } from '../function';
import { omit } from './omit';

describe('data first', () => {
  it('omit', () => {
    const result = omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd'] as const);
    expect(result).toEqual({ b: 2, c: 3 });
  });

  it('single removed prop works', () => {
    const obj: { a: number } = { a: 1 };
    const result = omit(obj, ['a']);
    expect(result).toEqual({});
  });
});

describe('data last', () => {
  it('omit', () => {
    const result = pipe({ a: 1, b: 2, c: 3, d: 4 }, omit(['a', 'd'] as const));
    expect(result).toEqual({ b: 2, c: 3 });
  });
});

it('type for curried form', () => {
  const omitFoo = omit(['foo']);

  const result = omitFoo({ foo: 1, bar: 'potato' });

  expectTypeOf(result).toEqualTypeOf<{ bar: string }>();
});
