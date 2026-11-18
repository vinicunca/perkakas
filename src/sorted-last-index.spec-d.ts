import { describe, expectTypeOf, it } from 'vitest';
import { map } from './map';
import { pipe } from './pipe';
import { sortedLastIndex } from './sorted-last-index';

type Status = 'active' | 'inactive' | 'pending';

describe('dataFirst', () => {
  it('a literal item among literal union items', () => {
    expectTypeOf(
      sortedLastIndex([] as Array<Status>, 'active'),
    ).toEqualTypeOf<number>();
  });

  it('an item wider than the items', () => {
    expectTypeOf(
      sortedLastIndex([] as Array<'a' | 'b'>, 'c'),
    ).toEqualTypeOf<number>();
  });

  it('an item narrower than the items', () => {
    expectTypeOf(
      sortedLastIndex([] as Array<bigint | number>, 2),
    ).toEqualTypeOf<number>();
  });

  it('rejects an item unrelated to the items', () => {
    // @ts-expect-error [ts2345] -- The items aren't numbers like the item.
    sortedLastIndex(['a'], 2);
  });
});

describe('dataLast', () => {
  it('a literal item among wider items', () => {
    expectTypeOf(pipe([1, 3, 5], sortedLastIndex(2))).toEqualTypeOf<number>();
  });

  it('an item wider than the items', () => {
    expectTypeOf(
      pipe([] as Array<'a' | 'b'>, sortedLastIndex('c')),
    ).toEqualTypeOf<number>();
  });

  it('as a callback', () => {
    expectTypeOf(
      map([] as Array<ReadonlyArray<number>>, sortedLastIndex(2)),
    ).toEqualTypeOf<Array<number>>();
  });

  it('a literal item outside a tuple\'s literal items', () => {
    expectTypeOf(
      pipe([1, 3, 5] as const, sortedLastIndex(2)),
    ).toEqualTypeOf<number>();
  });

  it('a literal item inside a tuple\'s literal items', () => {
    expectTypeOf(
      pipe([1, 3, 5] as const, sortedLastIndex(3)),
    ).toEqualTypeOf<number>();
  });

  it('a literal item among literal union items', () => {
    expectTypeOf(
      pipe([] as Array<Status>, sortedLastIndex('active')),
    ).toEqualTypeOf<number>();
  });

  it('an item narrower than the items', () => {
    expectTypeOf(
      pipe([] as Array<bigint | number>, sortedLastIndex(2)),
    ).toEqualTypeOf<number>();
  });

  it('an undefined item among possibly undefined items', () => {
    expectTypeOf(
      pipe([] as Array<number | undefined>, sortedLastIndex(undefined)),
    ).toEqualTypeOf<number>();
  });

  it('rejects an item unrelated to the items', () => {
    // @ts-expect-error [ts2322] -- The items aren't numbers like the item.
    pipe(['a'], sortedLastIndex(2));
  });
});
