import { expect, it } from 'vitest';
import { divide } from './divide';

it('data-first', () => {
  expect(divide(12, 3)).toBe(4);
});

it('data-last', () => {
  expect(divide(3)(12)).toBe(4);
});
