import { pipe } from './pipe';
import { prop } from './prop';

it('prop', () => {
  const result = pipe({ foo: 'bar' }, prop('foo'));
  expect(result).toEqual('bar');
});
