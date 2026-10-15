import type { Tagged } from 'type-fest';
import type { Cat, Legged } from '../../../test/interfaces';
import type { Assignability } from './assignability';
import { describe, expectTypeOf, it } from 'vitest';
import { $typed } from '../../../test/$typed';

declare function assignability<Item, Condition>(
  item: Item,
  condition: Condition,
): Assignability<
  Item,
  Condition,
  { full: 'full'; none: 'none'; partial: 'partial' }
>;

describe('full', () => {
  it('same type', () => {
    expectTypeOf(
      assignability($typed<string>(), $typed<string>()),
    ).toEqualTypeOf<'full'>();
  });

  it('literal item', () => {
    expectTypeOf(
      assignability($typed<'a'>(), $typed<string>()),
    ).toEqualTypeOf<'full'>();
  });

  it('union item with all members matching', () => {
    expectTypeOf(
      assignability($typed<'a' | 'b'>(), $typed<string>()),
    ).toEqualTypeOf<'full'>();
  });

  it('interface item with a wider condition', () => {
    expectTypeOf(
      assignability($typed<Cat>(), $typed<object>()),
    ).toEqualTypeOf<'full'>();
  });

  it('branded item with its base as the condition', () => {
    expectTypeOf(
      assignability($typed<Tagged<string, 'a'>>(), $typed<string>()),
    ).toEqualTypeOf<'full'>();
  });

  it('template literal item with its base as the condition', () => {
    expectTypeOf(
      assignability($typed<`foo${string}`>(), $typed<string>()),
    ).toEqualTypeOf<'full'>();
  });
});

describe('none', () => {
  it('disjoint primitives', () => {
    expectTypeOf(
      assignability($typed<number>(), $typed<string>()),
    ).toEqualTypeOf<'none'>();
  });

  it('primitive item with an array condition', () => {
    expectTypeOf(
      assignability($typed<number>(), $typed<Array<unknown>>()),
    ).toEqualTypeOf<'none'>();
  });

  it('function item with an array condition', () => {
    expectTypeOf(
      assignability($typed<() => void>(), $typed<Array<unknown>>()),
    ).toEqualTypeOf<'none'>();
  });

  it('`never` condition', () => {
    expectTypeOf(
      assignability($typed<string>(), $typed<never>()),
    ).toEqualTypeOf<'none'>();
  });

  it('branded item with a disjoint primitive condition', () => {
    expectTypeOf(
      assignability($typed<Tagged<string, 'a'>>(), $typed<number>()),
    ).toEqualTypeOf<'none'>();
  });
});

describe('partial', () => {
  it('union item with some members matching', () => {
    expectTypeOf(
      assignability($typed<number | string>(), $typed<string>()),
    ).toEqualTypeOf<'partial'>();
  });

  it('condition narrower than the item', () => {
    expectTypeOf(
      assignability($typed<string>(), $typed<'a'>()),
    ).toEqualTypeOf<'partial'>();
  });

  it('intersecting interfaces', () => {
    expectTypeOf(
      assignability($typed<Cat>(), $typed<Legged>()),
    ).toEqualTypeOf<'partial'>();
  });

  it('`unknown` item', () => {
    expectTypeOf(
      assignability($typed<unknown>(), $typed<string>()),
    ).toEqualTypeOf<'partial'>();
  });

  it('base item with a branded condition', () => {
    expectTypeOf(
      assignability($typed<string>(), $typed<Tagged<string, 'a'>>()),
    ).toEqualTypeOf<'partial'>();
  });

  it('branded item with a differently branded condition', () => {
    expectTypeOf(
      assignability(
        $typed<Tagged<string, 'a'>>(),
        $typed<Tagged<string, 'b'>>(),
      ),
    ).toEqualTypeOf<'partial'>();
  });

  it('overlapping template literals', () => {
    expectTypeOf(
      assignability($typed<`${string}_${number}`>(), $typed<`foo${string}`>()),
    ).toEqualTypeOf<'partial'>();
  });
});
