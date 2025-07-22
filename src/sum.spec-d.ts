import { describe, expectTypeOf, it } from 'vitest';
import { pipe } from './pipe';
import { sum } from './sum';

it('empty arrays', () => {
  const result = sum([] as const);

  expectTypeOf(result).toEqualTypeOf<0>();
});

describe('numbers', () => {
  it('arbitrary arrays', () => {
    const result = sum([] as Array<number>);

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('arbitrary readonly arrays', () => {
    const result = sum([] as ReadonlyArray<number>);

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('arbitrary non-empty arrays', () => {
    const result = sum([1, 2] as [number, ...Array<number>]);

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('consts', () => {
    const result = sum([1, 2, 3] as const);

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('fixed-size tuples', () => {
    const result = sum([1, 2] as [number, number]);

    expectTypeOf(result).toEqualTypeOf<number>();
  });
});

describe('bigints', () => {
  it('arbitrary arrays', () => {
    const result = sum([] as Array<bigint>);

    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });

  it('arbitrary readonly arrays', () => {
    const result = sum([] as ReadonlyArray<bigint>);

    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });

  it('arbitrary non-empty arrays', () => {
    const result = sum([1n, 2n] as [bigint, ...Array<bigint>]);

    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  it('consts', () => {
    const result = sum([1n, 2n, 3n] as const);

    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  it('fixed-size tuples', () => {
    const result = sum([1n, 2n] as [bigint, bigint]);

    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

describe('dataLast', () => {
  it('numbers', () => {
    const result = pipe([1, 2, 3] as const, sum());

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('bigints', () => {
    const result = pipe([1n, 2n, 3n] as const, sum());

    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

it('doesn\'t allow mixed arrays', () => {
  // @ts-expect-error [ts2345] - Can't sum bigints and numbers...
  sum([1, 2n]);
});

describe('KNOWN ISSUES', () => {
  it('Returns 0 (`number`) instead of 0n (`bigint`) for empty `bigint` arrays', () => {
    const result = sum([] as Array<bigint>);

    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });
});
