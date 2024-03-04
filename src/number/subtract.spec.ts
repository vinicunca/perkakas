import { expect, it } from 'vitest';

import { subtract } from './subtract';

it('data-first', () => {
  expect(subtract(10, 5)).toEqual(5);
  expect(subtract(10, -5)).toEqual(15);
});

it('data-last', () => {
  expect(subtract(5)(10)).toEqual(5);
  expect(subtract(-5)(10)).toEqual(15);
});
