import { expect, expectTypeOf, it } from 'vitest';

import { sortBy } from '../array';
import { pipe } from '../function/pipe';
import { prop } from './prop';

it('prop', () => {
  const result = pipe({ foo: 'bar' }, prop('foo'));
  expect(result).toEqual('bar');
});

it('prop typing', () => {
  const input = [{ a: 1 }];

  const works = sortBy(input, prop('a'));
  expectTypeOf(works).toEqualTypeOf<typeof input>();

  const doesntWork = pipe(input, sortBy(prop('a')));
  expectTypeOf(doesntWork).toEqualTypeOf<typeof input>();
});
