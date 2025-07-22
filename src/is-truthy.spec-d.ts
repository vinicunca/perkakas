import { expectTypeOf, it } from 'vitest';
import { isTruthy } from './is-truthy';

it('isTruthy', () => {
  const data: '' | 0 | false | { a: string } = { a: 'asd' };
  if (isTruthy(data)) {
    expectTypeOf(data).toEqualTypeOf<{ a: string }>();
  }
});
