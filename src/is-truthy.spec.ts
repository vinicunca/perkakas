import { isTruthy } from './is-truthy';

it('isTruthy', () => {
  const data: '' | 0 | false | { a: string } = { a: 'asd' };
  if (isTruthy(data)) {
    expect(data).toEqual({ a: 'asd' });
  }
});
