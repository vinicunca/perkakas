import { expect, it } from 'vitest';
import { pipe } from './pipe';
import { randomString } from './random-string';

it('randomString', () => {
  expect(randomString(10)).toHaveLength(10);
});

it('data-last', () => {
  expect(pipe(8, randomString())).toHaveLength(8);
});
