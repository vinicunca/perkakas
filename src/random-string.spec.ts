import { expect, it } from 'vitest';
import { randomString } from './random-string';

it('randomString', () => {
  expect(randomString(10)).toHaveLength(10);
});
