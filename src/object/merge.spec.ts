import { describe, expect, expectTypeOf, it } from 'vitest';

import { merge } from './merge';

interface FooInterface {
  [x: number]: unknown;
  [x: string]: unknown;
  bar: symbol;
  foo: string;
}

describe('data first', () => {
  it('should merge', () => {
    expect(merge({ x: 1, y: 2 }, { y: 10, z: 2 })).toEqual({
      x: 1,
      y: 10,
      z: 2,
    });
  });
});

describe('data last', () => {
  it('should merge', () => {
    expect(merge({ y: 10, z: 2 })({ x: 1, y: 2 })).toEqual({
      x: 1,
      y: 10,
      z: 2,
    });
  });
});

describe('typing', () => {
  it('source type overrides destination type', () => {
    expectTypeOf(merge({ a: 1, b: 'hello' }, { b: 2 })).toEqualTypeOf<{
      a: number;
      b: number;
    }>();
  });

  it('works with interfaces', () => {
    expectTypeOf(
      merge(
        {} as FooInterface,
        {} as {
          [x: number]: number;
          [x: symbol]: boolean;
          bar: Date;
          baz: boolean;
        },
      ),
    ).toEqualTypeOf<{
      [x: number]: number;
      [x: string]: unknown;
      [x: symbol]: boolean;
      bar: Date;
      baz: boolean;
      foo: string;
    }>();
  });

  it('a property can be replaced by another property that is not of the same type', () => {
    expectTypeOf(
      merge(
        { stripUndefinedValues: false } as { stripUndefinedValues: false },
        { stripUndefinedValues: true } as { stripUndefinedValues: true },
      ),
    ).toEqualTypeOf<{ stripUndefinedValues: true }>();
  });

  it('optional keys are enforced', () => {
    expectTypeOf(
      merge(
        {} as {
          [x: number]: unknown;
          [x: string]: unknown;
          a: string;
          b?: string;
          c: undefined;
          d: string;
          e: number | undefined;
        },
        {} as {
          [x: number]: number;
          [x: symbol]: boolean;
          a?: string;
          b: string;
          d?: string;
          f: number | undefined;
          g: undefined;
        },
      ),
    ).toEqualTypeOf<{
      // Note that `c` and `g` is not marked as optional and this is deliberate, as this is the behaviour expected by the older version of Merge. This may change in a later version.
      [x: number]: number;
      [x: string]: unknown;
      [x: symbol]: boolean;
      a?: string;
      b: string;
      c: undefined;
      d?: string;
      e: number | undefined;
      f: number | undefined;
      g: undefined;
    }>();
  });

  it('indexed key type can be overwritten', () => {
    expectTypeOf(
      merge(
        {} as {
          [x: number]: boolean;
          [x: string]: unknown;
          [x: symbol]: number;
          foo: boolean;
          fooBar: boolean;
        },
        {} as {
          [x: number]: number | string;
          [x: string]: boolean | number | string;
          [x: symbol]: symbol;
          bar: string;
          fooBar: string;
        },
      ),
    ).toEqualTypeOf<{
      [x: number]: number | string;
      [x: string]: boolean | number | string;
      [x: symbol]: symbol;
      bar: string;
      foo: boolean;
      fooBar: string;
    }>();
  });

  it('destination with any', () => {
    expectTypeOf(
      merge({} as { foo?: any }, {} as { bar: true }),
    ).toEqualTypeOf<{ bar: true; foo?: any }>();
  });

  it('source with any', () => {
    expectTypeOf(
      merge({} as { foo: true }, {} as { bar?: any }),
    ).toEqualTypeOf<{ bar?: any; foo: true }>();
  });

  it('type-fest issue #601?', () => {
    // Test for issue https://github.com/sindresorhus/type-fest/issues/601
    expectTypeOf(
      merge(
        {} as Pick<
          { t1?: number; t2?: number; t3?: number; t4?: number },
          't2' | 't4'
        >,
        {} as { list: Array<string> },
      ),
    ).toEqualTypeOf<{ list: Array<string>; t2?: number; t4?: number }>();
  });
});
