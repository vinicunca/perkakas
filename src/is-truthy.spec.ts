import { isTruthy } from './is-truthy';

it('isTruthy', () => {
  expect(isTruthy({ a: 'asd' })).toBe(true);
});
