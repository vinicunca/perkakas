import { expectTypeOf, it } from 'vitest';
import { merge } from './merge';

interface FooInterface {
  [x: string]: unknown;
  [x: number]: unknown;
  foo: string;
  bar: symbol;
}

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
    [x: string]: unknown;
    [x: number]: number;
    [x: symbol]: boolean;
    foo: string;
    bar: Date;
    baz: boolean;
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
        [x: string]: unknown;
        [x: number]: unknown;
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
    [x: symbol]: boolean;
    [x: string]: unknown;
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
        [x: string]: unknown;
        [x: number]: boolean;
        [x: symbol]: number;
        foo: boolean;
        fooBar: boolean;
      },
      {} as {
        [x: string]: boolean | number | string;
        [x: number]: number | string;
        [x: symbol]: symbol;
        bar: string;
        fooBar: string;
      },
    ),
  ).toEqualTypeOf<{
    [x: string]: boolean | number | string;
    [x: number]: number | string;
    [x: symbol]: symbol;
    foo: boolean;
    bar: string;
    fooBar: string;
  }>();
});

it('destination with any', () => {
  /* eslint-disable ts/no-explicit-any -- Intentional! */
  expectTypeOf(merge({} as { foo?: any }, {} as { bar: true })).toEqualTypeOf<{
    foo?: any;
    bar: true;
  }>();
  /* eslint-enable ts/no-explicit-any */
});

it('source with any', () => {
  /* eslint-disable ts/no-explicit-any -- Intentional! */
  expectTypeOf(merge({} as { foo: true }, {} as { bar?: any })).toEqualTypeOf<{
    foo: true;
    bar?: any;
  }>();
  /* eslint-enable ts/no-explicit-any */
});

it('Type-fest issue #601?', () => {
  // Test for issue https://github.com/sindresorhus/type-fest/issues/601
  expectTypeOf(
    merge(
      {} as Pick<
        { t1?: number; t2?: number; t3?: number; t4?: number },
        't2' | 't4'
      >,
      {} as { list: Array<string> },
    ),
  ).toEqualTypeOf<{ t2?: number; t4?: number; list: Array<string> }>();
});
