import { describe, expectTypeOf, it } from 'vitest';
import { constant } from './constant';
import { pipe } from './pipe';
import { sumBy } from './sum-by';

it('empty array', () => {
  const result1 = sumBy([], constant(1n));
  expectTypeOf(result1).toEqualTypeOf<0>();

  const result2 = sumBy([], constant(1));
  expectTypeOf(result2).toEqualTypeOf<0>();
});

it('disallow mixed mapper', () => {
  const toNumberOrBigint = constant(1 as bigint | number);
  // @ts-expect-error [ts2769]: Type `number | bigint` is not assignable to type number
  // Type `number | bigint` is not assignable to type bigint
  sumBy([], toNumberOrBigint);
  // @ts-expect-error [ts2769]: Type `number | bigint` is not assignable to type number
  // Type `number | bigint` is not assignable to type bigint
  pipe([], sumBy(toNumberOrBigint));
});

describe('numbers', () => {
  it('arbitrary arrays', () => {
    const result = sumBy([] as Array<unknown>, constant(1));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('arbitrary readonly arrays', () => {
    const result = sumBy([] as ReadonlyArray<unknown>, constant(1));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('arbitrary non-empty arrays', () => {
    const result = sumBy([1, 2] as [unknown, ...Array<unknown>], constant(1));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('consts', () => {
    const result = sumBy([1, 2, 3] as const, constant(1));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('fixed-size tuples', () => {
    const result = sumBy([1, 2] as [unknown, unknown], constant(1));
    expectTypeOf(result).toEqualTypeOf<number>();
  });
});

describe('bigints', () => {
  it('arbitrary arrays', () => {
    const result = sumBy([] as Array<unknown>, constant(1n));
    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });

  it('arbitrary readonly arrays', () => {
    const result = sumBy([] as ReadonlyArray<unknown>, constant(1n));
    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });

  it('arbitrary non-empty arrays', () => {
    const result = sumBy(
      [1n, 2n] as [unknown, ...Array<unknown>],
      constant(1n),
    );
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  it('consts', () => {
    const result = sumBy([1n, 2n, 3n] as const, constant(1n));
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  it('fixed-size tuples', () => {
    const result = sumBy([1n, 2n] as [unknown, unknown], constant(1n));
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

describe('dataLast', () => {
  it('numbers', () => {
    const result = pipe([1, 2, 3] as const, sumBy(constant(1)));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('bigints', () => {
    const result = pipe([1n, 2n, 3n] as const, sumBy(constant(1n)));
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  it('empty array number', () => {
    const result = pipe([] as const, sumBy(constant(1)));
    expectTypeOf(result).toEqualTypeOf<0>();
  });

  it('empty array bigint', () => {
    const result = pipe([] as const, sumBy(constant(1n)));
    expectTypeOf(result).toEqualTypeOf<0>();
  });
});
