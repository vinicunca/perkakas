import { assertType, describe, expect, it } from 'vitest';

import { isTruthy } from './is-truthy';

describe('isTruthy', () => {
  it('isTruthy', () => {
    const data: '' | { a: string } | 0 | false = { a: 'asd' };
    if (isTruthy(data)) {
      expect(data).toEqual({ a: 'asd' });
      assertType<{ a: string }>(data);
    }
  });
});
