import type { First } from './first';
import type { IterableContainer } from './iterable-container';
import { describe, expectTypeOf, it } from 'vitest';

declare function first<T extends IterableContainer>(data: T): First<T>;

describe('tuple shapes', () => {
  it('empty tuple', () => {
    expectTypeOf(first([])).toEqualTypeOf<undefined>();
  });

  it('fixed tuple', () => {
    expectTypeOf(first(['a', 'b', 'c'] as const)).toEqualTypeOf<'a'>();
  });

  it('optional tuple', () => {
    expectTypeOf(first([] as ['a'?, 'b'?, 'c'?])).toEqualTypeOf<
      'a' | 'b' | 'c' | undefined
    >();
  });

  it('mixed tuple', () => {
    expectTypeOf(
      first(['a', 'b'] as ['a', 'b', 'c'?, 'd'?]),
    ).toEqualTypeOf<'a'>();
  });

  it('array', () => {
    expectTypeOf(first([] as Array<'a'>)).toEqualTypeOf<'a' | undefined>();
  });

  it('fixed-prefix array', () => {
    expectTypeOf(first(['a'] as ['a', ...Array<'b'>])).toEqualTypeOf<'a'>();
  });

  it('optional-prefix array', () => {
    expectTypeOf(first([] as ['a'?, ...Array<'b'>])).toEqualTypeOf<
      'a' | 'b' | undefined
    >();
  });

  it('mixed-prefix array', () => {
    expectTypeOf(first(['a'] as ['a', 'b'?, ...Array<'c'>])).toEqualTypeOf<'a'>();
  });

  it('fixed-suffix array', () => {
    expectTypeOf(first(['b'] as [...Array<'a'>, 'b'])).toEqualTypeOf<'a' | 'b'>();
  });

  it('fixed-elements array', () => {
    expectTypeOf(
      first(['a', 'c'] as ['a', ...Array<'b'>, 'c']),
    ).toEqualTypeOf<'a'>();
  });
});

describe('unions', () => {
  it('arrays', () => {
    expectTypeOf(first([] as Array<'a'> | Array<'b'>)).toEqualTypeOf<
      'a' | 'b' | undefined
    >();
  });

  it('tuple and array', () => {
    expectTypeOf(first([] as ['a'] | Array<'b'>)).toEqualTypeOf<
      'a' | 'b' | undefined
    >();
  });

  it('optional and fixed tuples', () => {
    expectTypeOf(first([] as ['a'?] | ['b'])).toEqualTypeOf<
      'a' | 'b' | undefined
    >();
  });

  it('non-empty members', () => {
    expectTypeOf(first(['b'] as [...Array<'a'>, 'b'] | ['c'])).toEqualTypeOf<
      'a' | 'b' | 'c'
    >();
  });
});
