import { expect, it } from 'vitest';

import { multiply } from './multiply';

it('data-first', () => {
  expect(multiply(3, 4)).toEqual(12);
});

it('data-last', () => {
  expect(multiply(4)(3)).toEqual(12);
});
