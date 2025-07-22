import type { Deduped } from './deduped';
import type { IterableContainer } from './iterable-container';
import { describe, expectTypeOf, it } from 'vitest';

declare function deduped<T extends IterableContainer>(data: T): Deduped<T>;

describe('mutable', () => {
  it('empty array', () => {
    const result = deduped([] as []);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('simple array', () => {
    const result = deduped([1, 2, 3] as Array<number>);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('array with prefix', () => {
    const result = deduped(['a'] as [string, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<[string, ...Array<number>]>();
  });

  it('array with suffix', () => {
    const result = deduped(['a'] as [...Array<number>, string]);
    expectTypeOf(result).toEqualTypeOf<
      [number | string, ...Array<number | string>]
    >();
  });

  it('array with both prefix and suffix', () => {
    const result = deduped(['a', true] as [string, ...Array<number>, boolean]);
    expectTypeOf(result).toEqualTypeOf<[string, ...Array<boolean | number>]>();
  });

  it('union of arrays', () => {
    const result = deduped(['a'] as
      | [number, ...Array<number>]
      | [string, ...Array<string>]);
    expectTypeOf(result).toEqualTypeOf<
      [number, ...Array<number>] | [string, ...Array<string>]
    >();
  });
});

describe('readonly', () => {
  it('empty array', () => {
    const result = deduped([] as const);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('simple array', () => {
    const result = deduped([1, 2, 3] as ReadonlyArray<number>);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('array with prefix', () => {
    const result = deduped(['a'] as readonly [string, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<[string, ...Array<number>]>();
  });

  it('array with suffix', () => {
    const result = deduped(['a'] as readonly [...Array<number>, string]);
    expectTypeOf(result).toEqualTypeOf<
      [number | string, ...Array<number | string>]
    >();
  });

  it('array with both prefix and suffix', () => {
    const result = deduped(['a', true] as readonly [
      string,
      ...Array<number>,
      boolean,
    ]);
    expectTypeOf(result).toEqualTypeOf<[string, ...Array<boolean | number>]>();
  });

  it('union of arrays', () => {
    const result = deduped(['a'] as
      | readonly [number, ...Array<number>]
      | readonly [string, ...Array<string>]);
    expectTypeOf(result).toEqualTypeOf<
      [number, ...Array<number>] | [string, ...Array<string>]
    >();
  });

  it('constant tuple', () => {
    const result = deduped([1, 2, 3] as const);
    expectTypeOf(result).toEqualTypeOf<[1, ...Array<2 | 3>]>();
  });
});
