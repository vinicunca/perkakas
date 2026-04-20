import { describe, expectTypeOf, it } from 'vitest';
import { median } from './median';
import { pipe } from './pipe';

it('empty arrays', () => {
  const result = median([] as const);

  expectTypeOf(result).toEqualTypeOf<undefined>();
});

describe('dataFirst', () => {
  it('arbitrary arrays', () => {
    const result = median([] as Array<number>);

    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it('arbitrary readonly arrays', () => {
    const result = median([] as ReadonlyArray<number>);

    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it('arbitrary non-empty arrays', () => {
    const result = median([1, 2] as [number, ...Array<number>]);

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('consts', () => {
    const result = median([1, 2, 3] as const);

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('fixed-size tuples', () => {
    const result = median([1, 2] as [number, number]);

    expectTypeOf(result).toEqualTypeOf<number>();
  });
});

describe('dataLast', () => {
  it('numbers', () => {
    const result = pipe([1, 2, 3] as const, median());

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it('arbitrary number arrays', () => {
    const result = pipe([] as Array<number>, median());

    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it('arbitrary readonly number arrays', () => {
    const result = pipe([] as ReadonlyArray<number>, median());

    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });
});
