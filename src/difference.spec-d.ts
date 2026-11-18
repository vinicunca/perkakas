import { describe, expectTypeOf, it } from 'vitest';
import { $typed } from '../test/$typed';
import { difference } from './difference';
import { map } from './map';
import { pipe } from './pipe';

type Status = 'active' | 'inactive' | 'pending';

interface Task {
  readonly priority: 'high' | 'low' | 'medium';
  readonly score: number;
}

interface Animal { readonly name: string }
type Dog = Animal & { readonly breed: string };

describe('dataFirst', () => {
  it('an undefined value among possibly undefined items', () => {
    expectTypeOf(
      difference([] as Array<number | undefined>, [undefined]),
    ).toEqualTypeOf<Array<number | undefined>>();
  });

  it('rejects values unrelated to the items', () => {
    // @ts-expect-error [ts2322] -- The values aren't strings like the items.
    difference(['a'], [2]);
  });
});

describe('dataLast', () => {
  it('a literal value among wider items', () => {
    expectTypeOf(pipe([1, 2, 3], difference([2]))).toEqualTypeOf<Array<number>>();
  });

  it('values wider than the items', () => {
    expectTypeOf(pipe([] as Array<'a' | 'b'>, difference(['c']))).toEqualTypeOf<
      Array<'a' | 'b'>
    >();
  });

  it('as a callback', () => {
    expectTypeOf(
      map([] as Array<ReadonlyArray<number>>, difference([2])),
    ).toEqualTypeOf<Array<Array<number>>>();
  });

  it('as a callback with values wider than the items', () => {
    expectTypeOf(
      map([] as Array<ReadonlyArray<'a' | 'b'>>, difference(['c'])),
    ).toEqualTypeOf<Array<Array<'a' | 'b'>>>();
  });

  it('a literal value outside a tuple\'s literal items', () => {
    expectTypeOf(pipe([1, 3, 5] as const, difference([2]))).toEqualTypeOf<
      Array<1 | 3 | 5>
    >();
  });

  it('a literal value inside a tuple\'s literal items', () => {
    expectTypeOf(pipe([1, 3, 5] as const, difference([3]))).toEqualTypeOf<
      Array<1 | 3 | 5>
    >();
  });

  it('a literal value among literal union items', () => {
    expectTypeOf(pipe([] as Array<Status>, difference(['active']))).toEqualTypeOf<
      Array<Status>
    >();
  });

  it('literal union values narrower than the items', () => {
    expectTypeOf(
      pipe([] as Array<Status>, difference([] as Array<'active' | 'pending'>)),
    ).toEqualTypeOf<Array<Status>>();
  });

  it('no values', () => {
    expectTypeOf(pipe([] as Array<Status>, difference([]))).toEqualTypeOf<
      Array<Status>
    >();
  });

  it('an object value with a literal union prop', () => {
    expectTypeOf(
      pipe([] as Array<Task>, difference([
        { priority: 'high', score: 2 },
      ])),
    ).toEqualTypeOf<Array<Task>>();
  });

  it('an undefined value among possibly undefined items', () => {
    expectTypeOf(
      pipe([] as Array<number | undefined>, difference([undefined])),
    ).toEqualTypeOf<Array<number | undefined>>();
  });

  it('a subtype value among supertype items', () => {
    expectTypeOf(
      pipe([] as Array<Animal>, difference([
        $typed<Dog>(),
      ])),
    ).toEqualTypeOf<Array<Animal>>();
  });

  it('rejects values unrelated to the items', () => {
    // @ts-expect-error [ts2322] -- The items aren't numbers like the values.
    pipe(['a'], difference([2]));
  });
});
