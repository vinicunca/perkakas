import type { IterableContainer } from './iterable-container';
import type { TupleParts } from './tuple-parts';
import { describe, expectTypeOf, it } from 'vitest';

declare function tupleParts<T extends IterableContainer>(x: T): TupleParts<T>;

describe('all tuple/array shapes (mutable and readonly)', () => {
  it('empty tuples', () => {
    expectTypeOf(tupleParts([] as [])).toEqualTypeOf<{
      required: [];
      optional: [];
      item: never;
      suffix: [];
    }>();

    expectTypeOf(tupleParts([] as const)).toEqualTypeOf<{
      required: [];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  it('arrays', () => {
    expectTypeOf(tupleParts([] as Array<number>)).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number;
      suffix: [];
    }>();

    expectTypeOf(tupleParts([] as ReadonlyArray<number>)).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number;
      suffix: [];
    }>();
  });

  it('fixed tuples', () => {
    expectTypeOf(
      tupleParts([1, 'hello', true, new Date()] as [
        number,
        string,
        boolean,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [number, string, boolean, Date];
      optional: [];
      item: never;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([1, 'hello', true, new Date()] as readonly [
        number,
        string,
        boolean,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [number, string, boolean, Date];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  it('fixed-prefix arrays', () => {
    expectTypeOf(
      tupleParts([1, 'hello', true] as [
        number,
        string,
        boolean,
        ...Array<Date>,
      ]),
    ).toEqualTypeOf<{
      required: [number, string, boolean];
      optional: [];
      item: Date;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([1, 'hello', true] as readonly [
        number,
        string,
        boolean,
        ...Array<Date>,
      ]),
    ).toEqualTypeOf<{
      required: [number, string, boolean];
      optional: [];
      item: Date;
      suffix: [];
    }>();
  });

  it('fixed-suffix arrays', () => {
    expectTypeOf(
      tupleParts(['a', true, new Date()] as [
        ...Array<number>,
        string,
        boolean,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number;
      suffix: [string, boolean, Date];
    }>();

    expectTypeOf(
      tupleParts(['a', true, new Date()] as readonly [
        ...Array<number>,
        string,
        boolean,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number;
      suffix: [string, boolean, Date];
    }>();
  });

  it('fixed-elements arrays', () => {
    expectTypeOf(
      tupleParts([1, 'a', new Date()] as [
        number,
        string,
        ...Array<boolean>,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [];
      item: boolean;
      suffix: [Date];
    }>();

    expectTypeOf(
      tupleParts([1, 'a', new Date()] as readonly [
        number,
        string,
        ...Array<boolean>,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [];
      item: boolean;
      suffix: [Date];
    }>();
  });

  it('optional tuples', () => {
    expectTypeOf(
      tupleParts([] as [number?, string?, boolean?, Date?]),
    ).toEqualTypeOf<{
      required: [];
      optional: [number, string, boolean, Date];
      item: never;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([] as readonly [number?, string?, boolean?, Date?]),
    ).toEqualTypeOf<{
      required: [];
      optional: [number, string, boolean, Date];
      item: never;
      suffix: [];
    }>();
  });

  it('optional-prefix arrays', () => {
    expectTypeOf(
      tupleParts([] as [number?, string?, boolean?, ...Array<Date>]),
    ).toEqualTypeOf<{
      required: [];
      optional: [number, string, boolean];
      item: Date;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([] as readonly [number?, string?, boolean?, ...Array<Date>]),
    ).toEqualTypeOf<{
      required: [];
      optional: [number, string, boolean];
      item: Date;
      suffix: [];
    }>();
  });

  it('mixed tuples', () => {
    expectTypeOf(
      tupleParts([1, 'a'] as [number, string, boolean?, Date?]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [boolean, Date];
      item: never;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([1, 'a'] as readonly [number, string, boolean?, Date?]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [boolean, Date];
      item: never;
      suffix: [];
    }>();
  });

  it('mixed-prefix arrays', () => {
    expectTypeOf(
      tupleParts([1, 'a'] as [number, string, boolean?, ...Array<Date>]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [boolean];
      item: Date;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([1, 'a'] as readonly [
        number,
        string,
        boolean?,
        ...Array<Date>,
      ]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [boolean];
      item: Date;
      suffix: [];
    }>();
  });
});

describe('unions', () => {
  it('union of arrays', () => {
    expectTypeOf(
      tupleParts([] as Array<boolean> | Array<number>),
    ).toEqualTypeOf<
      | { required: []; optional: []; item: boolean; suffix: [] }
      | { required: []; optional: []; item: number; suffix: [] }
    >();
  });

  it('mixed unions', () => {
    expectTypeOf(
      tupleParts([] as Array<boolean> | [number, string]),
    ).toEqualTypeOf<
      | { required: []; optional: []; item: boolean; suffix: [] }
      | {
        required: [number, string];
        optional: [];
        item: never;
        suffix: [];
      }
    >();
  });

  it('looks like an optional tuple', () => {
    expectTypeOf(tupleParts([] as [] | [string | undefined])).toEqualTypeOf<
      | { required: []; optional: []; item: never; suffix: [] }
      | {
        required: [string | undefined];
        optional: [];
        item: never;
        suffix: [];
      }
    >();
  });
});

describe('handling of undefined values', () => {
  it('undefined required item', () => {
    expectTypeOf(
      tupleParts([undefined] as [number | undefined]),
    ).toEqualTypeOf<{
      required: [number | undefined];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  it('undefined optional item', () => {
    expectTypeOf(tupleParts([] as [(number | undefined)?])).toEqualTypeOf<{
      required: [];
      optional: [number | undefined];
      item: never;
      suffix: [];
    }>();
  });

  it('undefined creates a different item type', () => {
    expectTypeOf(
      tupleParts(
        [] as [number?, (number | undefined)?, number?, (number | undefined)?],
      ),
    ).toEqualTypeOf<{
      required: [];
      optional: [number, number | undefined, number, number | undefined];
      item: never;
      suffix: [];
    }>();
  });

  it('undefined rest item', () => {
    expectTypeOf(tupleParts([] as Array<number | undefined>)).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number | undefined;
      suffix: [];
    }>();
  });

  it('undefined suffix and rest items', () => {
    expectTypeOf(
      tupleParts([undefined] as [
        ...Array<number | undefined>,
        string | undefined,
      ]),
    ).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number | undefined;
      suffix: [string | undefined];
    }>();
  });

  it('undefined tuple with options', () => {
    expectTypeOf(
      tupleParts([undefined] as [number | undefined, (string | undefined)?]),
    ).toEqualTypeOf<{
      required: [number | undefined];
      optional: [string | undefined];
      item: never;
      suffix: [];
    }>();
  });

  it('undefined prefix items', () => {
    expectTypeOf(
      tupleParts([undefined] as [
        number | undefined,
        (string | undefined)?,
        ...Array<boolean | undefined>,
      ]),
    ).toEqualTypeOf<{
      required: [number | undefined];
      optional: [string | undefined];
      item: boolean | undefined;
      suffix: [];
    }>();
  });

  it('undefined fixed and rest elements', () => {
    expectTypeOf(
      tupleParts([undefined, undefined] as [
        number | undefined,
        ...Array<boolean | undefined>,
        string | undefined,
      ]),
    ).toEqualTypeOf<{
      required: [number | undefined];
      optional: [];
      item: boolean | undefined;
      suffix: [string | undefined];
    }>();
  });
});
