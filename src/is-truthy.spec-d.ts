import { isTruthy } from './is-truthy';

test('isTruthy', () => {
  const data: '' | 0 | false | { a: string } = { a: 'asd' };
  if (isTruthy(data)) {
    expectTypeOf(data).toEqualTypeOf<{ a: string }>();
  }
});
