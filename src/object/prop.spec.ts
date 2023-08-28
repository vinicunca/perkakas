import { sortBy } from '../array/sortBy';
import { pipe } from '../function/pipe';
import { prop } from './prop';

test('prop', () => {
  const result = pipe({ foo: 'bar' }, prop('foo'));
  expect(result).toEqual('bar');
});

test('prop typing', () => {
  const input = [{ a: 1 }];

  const works = sortBy(input, prop('a'));
  expectTypeOf(works).toEqualTypeOf<typeof input>();

  const doesntWork = pipe(input, sortBy(prop('a')));
  expectTypeOf(doesntWork).toEqualTypeOf<typeof input>();
});
