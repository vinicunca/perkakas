import { assertType, describe, expect, it } from 'vitest';
import { isTruthy } from './is-truthy';

describe('isTruthy', () => {
  it('isTruthy', () => {
    const data: false | '' | 0 | { a: string } = { a: 'asd' };
    if (isTruthy(data)) {
      expect(data).toEqual({ a: 'asd' });
      assertType<{ a: string }>(data);
    }
  });
});