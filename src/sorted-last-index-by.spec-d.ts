import { describe, expectTypeOf, it } from 'vitest';
import { $typed } from '../test/$typed';
import { identity } from './identity';
import { map } from './map';
import { pipe } from './pipe';
import { prop } from './prop';
import { sortedLastIndexBy } from './sorted-last-index-by';

type Status = 'active' | 'inactive' | 'pending';

interface Task {
  readonly priority: 'high' | 'low' | 'medium';
  readonly score: number;
}

interface Animal { readonly name: string }
type Dog = Animal & { readonly breed: string };

describe('dataFirst', () => {
  it('a literal item among literal union items', () => {
    expectTypeOf(
      sortedLastIndexBy([] as Array<Status>, 'active', identity()),
    ).toEqualTypeOf<number>();
  });

  it('an item wider than the items', () => {
    expectTypeOf(
      sortedLastIndexBy([] as Array<'a' | 'b'>, 'c', identity()),
    ).toEqualTypeOf<number>();
  });

  it('rejects an item unrelated to the items', () => {
    // @ts-expect-error [ts2345] -- The items aren't numbers like the item.
    sortedLastIndexBy(['a'], 2, identity());
  });
});

describe('dataLast', () => {
  it('a literal item among wider items', () => {
    expectTypeOf(
      pipe([1, 3, 5], sortedLastIndexBy(2, identity())),
    ).toEqualTypeOf<number>();
  });

  it('an item wider than the items', () => {
    expectTypeOf(
      pipe([] as Array<'a' | 'b'>, sortedLastIndexBy('c', identity())),
    ).toEqualTypeOf<number>();
  });

  it('as a callback', () => {
    expectTypeOf(
      map([] as Array<ReadonlyArray<number>>, sortedLastIndexBy(2, identity())),
    ).toEqualTypeOf<Array<number>>();
  });

  it('value functions receive the item\'s type', () => {
    pipe(
      [
        { a: 5 },
        { a: 1 },
      ],
      sortedLastIndexBy({ a: 2 }, (item, _index, data) => {
        expectTypeOf(item).toEqualTypeOf<{ a: number }>();
        expectTypeOf(data).toEqualTypeOf<ReadonlyArray<{ a: number }>>();

        return item.a;
      }),
    );
  });

  it('a literal item outside a tuple\'s literal items', () => {
    expectTypeOf(
      pipe([1, 3, 5] as const, sortedLastIndexBy(2, identity())),
    ).toEqualTypeOf<number>();
  });

  it('a literal item inside a tuple\'s literal items', () => {
    expectTypeOf(
      pipe([1, 3, 5] as const, sortedLastIndexBy(3, identity())),
    ).toEqualTypeOf<number>();
  });

  it('a literal item among literal union items', () => {
    expectTypeOf(
      pipe([] as Array<Status>, sortedLastIndexBy('active', identity())),
    ).toEqualTypeOf<number>();
  });

  it('a literal item with an inline value function', () => {
    expectTypeOf(
      pipe(
        [] as Array<Status>,
        sortedLastIndexBy('active', (status) => status.length),
      ),
    ).toEqualTypeOf<number>();
  });

  it('a literal item with a value function typed on literal union items', () => {
    expectTypeOf(
      pipe(
        [] as Array<Status>,
        sortedLastIndexBy('active', (status: Status) => status.length),
      ),
    ).toEqualTypeOf<number>();
  });

  it('an object item with a literal union prop', () => {
    expectTypeOf(
      pipe(
        [] as Array<Task>,
        sortedLastIndexBy({ priority: 'high', score: 2 }, (task) => task.score),
      ),
    ).toEqualTypeOf<number>();
  });

  it('an undefined item among possibly undefined items', () => {
    expectTypeOf(
      pipe(
        [] as Array<number | undefined>,
        sortedLastIndexBy(undefined, (item) => item ?? 0),
      ),
    ).toEqualTypeOf<number>();
  });

  it('a subtype item among supertype items', () => {
    expectTypeOf(
      pipe([] as Array<Animal>, sortedLastIndexBy($typed<Dog>(), prop('name'))),
    ).toEqualTypeOf<number>();
  });

  it('rejects an item unrelated to the items', () => {
    // @ts-expect-error [ts2322] -- The items aren't numbers like the item.
    pipe(['a'], sortedLastIndexBy(2, identity()));
  });

  it('rejects a value function reading a prop the item lacks', () => {
    pipe([
      { a: 5, b: 1 },
      // @ts-expect-error [ts2769] -- The item has no `a` for the value function to read.
    ], sortedLastIndexBy({ b: 2 }, prop('a')));
  });
});

describe('known issues!', () => {
  it('a value function typed on an item wider than the items', () => {
    // The item isn't one of the items, so `T` is inferred from the item alone,
    // widening the literal to its primitive (`string`), which the value
    // function's parameter doesn't accept. Typing the item
    // (`"c" as "a" | "b" | "c"`) avoids the widening, and an unannotated value
    // function takes the widened type.
    pipe(
      [] as Array<'a' | 'b'>,
      // @ts-expect-error [ts2769] -- The call is valid, the value function accepts the item and every one of the items.
      sortedLastIndexBy('c', (letter: 'a' | 'b' | 'c') => letter.length),
    );
  });
});
