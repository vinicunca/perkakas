import { pipe } from './pipe';
import { prop } from './prop';
import { sortBy } from './sort-by';

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
