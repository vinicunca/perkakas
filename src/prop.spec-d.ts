import { expectTypeOf, it } from 'vitest';
import { map } from './map';
import { pipe } from './pipe';
import { prop } from './prop';
import { sortBy } from './sort-by';

it('prop typing', () => {
  const input = [{ a: 1 }];

  const works = sortBy(input, prop('a'));
  expectTypeOf(works).toEqualTypeOf<typeof input>();

  const doesntWork = pipe(input, sortBy(prop('a')));
  expectTypeOf(doesntWork).toEqualTypeOf<typeof input>();
});

it('prop typing standalone', () => {
  const standAlonePropA = prop('a');
  const result = standAlonePropA({ a: 1 });
  expectTypeOf(result).toEqualTypeOf<number>();
});

it('as a callback function', () => {
  const standAlonePropA = prop('a');
  const result = map([{ a: 1 }, { a: 2 }], standAlonePropA);
  expectTypeOf(result).toEqualTypeOf<[number, number]>();
});

it('prop expect error', () => {
  const standAlonePropB = prop('b');
  // @ts-expect-error [ts2353] -- b is not a key of typeof item
  standAlonePropB({ a: 1 });
});
