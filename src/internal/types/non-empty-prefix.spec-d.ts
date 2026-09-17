import type { IterableContainer } from './iterable-container';
import type { NonEmptyArray } from './non-empty-array';
import type { NonEmptyPrefix } from './non-empty-prefix';
import { describe, expectTypeOf, it, test } from 'vitest';

declare function nonEmptyPrefix<T extends IterableContainer>(
  data: T,
): NonEmptyPrefix<T>;

describe('tuple shapes', () => {
  it('empty tuple', () => {
    expectTypeOf(nonEmptyPrefix([])).toEqualTypeOf<never>();
  });

  it('fixed tuple', () => {
    expectTypeOf(
      nonEmptyPrefix(['a', 'b', 'c', 'd', 'e'] as ['a', 'b', 'c', 'd', 'e']),
    ).toEqualTypeOf<['a', 'b'?, 'c'?, 'd'?, 'e'?]>();
  });

  it('optional tuple', () => {
    expectTypeOf(
      nonEmptyPrefix([] as ['a'?, 'b'?, 'c'?, 'd'?, 'e'?]),
    ).toEqualTypeOf<['a', 'b'?, 'c'?, 'd'?, 'e'?]>();
  });

  it('mixed tuple', () => {
    expectTypeOf(
      nonEmptyPrefix(['a', 'b'] as ['a', 'b', 'c'?, 'd'?, 'e'?]),
    ).toEqualTypeOf<['a', 'b'?, 'c'?, 'd'?, 'e'?]>();
  });

  it('array', () => {
    expectTypeOf(nonEmptyPrefix([] as Array<'a'>)).toEqualTypeOf<['a', ...Array<'a'>]>();
  });

  it('fixed-prefix array', () => {
    expectTypeOf(
      nonEmptyPrefix(['a', 'b'] as ['a', 'b', ...Array<'c'>]),
    ).toEqualTypeOf<['a', 'b'?, ...Array<'c'>]>();
  });

  it('optional-prefix array', () => {
    expectTypeOf(nonEmptyPrefix([] as ['a'?, 'b'?, ...Array<'c'>])).toEqualTypeOf<
      ['a', 'b'?, ...Array<'c'>]
    >();
  });

  it('mixed-prefix array', () => {
    expectTypeOf(
      nonEmptyPrefix(['a', 'b'] as ['a', 'b', 'c'?, 'd'?, ...Array<'e'>]),
    ).toEqualTypeOf<['a', 'b'?, 'c'?, 'd'?, ...Array<'e'>]>();
  });

  it('fixed-suffix array', () => {
    expectTypeOf(
      nonEmptyPrefix(['b', 'c'] as [...Array<'a'>, 'b', 'c']),
    ).toEqualTypeOf<
      | ['a', ...Array<'a'>]
      | ['a', ...Array<'a'>, 'b']
      | ['a', ...Array<'a'>, 'b', 'c']
      | ['b', 'c'?]
    >();
  });

  it('fixed-elements array', () => {
    expectTypeOf(
      nonEmptyPrefix(['a', 'b', 'd', 'e'] as ['a', 'b', ...Array<'c'>, 'd', 'e']),
    ).toEqualTypeOf<
      | ['a', 'b'?, ...Array<'c'>]
      | ['a', 'b', ...Array<'c'>, 'd']
      | ['a', 'b', ...Array<'c'>, 'd', 'e']
    >();
  });
});

describe('structurally non-empty', () => {
  it('fixed-suffix array', () => {
    expectTypeOf(nonEmptyPrefix(['b', 'c'] as [...Array<'a'>, 'b', 'c'])).toExtend<
      NonEmptyArray<unknown>
    >();
  });

  it('fixed-elements array', () => {
    expectTypeOf(
      nonEmptyPrefix(['a', 'b', 'd', 'e'] as ['a', 'b', ...Array<'c'>, 'd', 'e']),
    ).toExtend<NonEmptyArray<unknown>>();
  });
});

test('union of tuples with different shapes', () => {
  expectTypeOf(
    nonEmptyPrefix(['a', 'b'] as ['a', 'b'] | ['c', ...Array<'d'>]),
  ).toEqualTypeOf<['a', 'b'?] | ['c', ...Array<'d'>]>();
});

describe('known issues!', () => {
  it('tuple prefixes aren\'t assignable to arrays', () => {
    const result = nonEmptyPrefix(['a', 'b', 'c']);

    expectTypeOf(result).toEqualTypeOf<[string, string?, string?]>();

    // TypeScript adds `undefined` to reads of optional tuple elements even
    // under `exactOptionalPropertyTypes`, where `undefined` is rejected as a
    // value in those slots (@see
    // https://github.com/microsoft/TypeScript/pull/50831). So the prefix of a
    // tuple isn't assignable to an array of its items, although every value it
    // describes would be. Users hit this when the input to `pipe` is a tuple
    // and the callback passes `data` to something that expects an array (e.g.,
    // `sum(data)`). If this test fails, TypeScript changed this behavior and
    // the limitation should be removed from the docs.
    expectTypeOf(result).items.toEqualTypeOf<string | undefined>();
    expectTypeOf(result).items.not.toEqualTypeOf<string>();
    expectTypeOf(result).not.toExtend<ReadonlyArray<'a' | 'b' | 'c'>>();
  });
});
