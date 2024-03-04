import { expect, it } from 'vitest';

import { add } from './add';

it('data-first', () => {
  expect(add(10, 5)).toEqual(15);
  expect(add(10, -5)).toEqual(5);
});

it('data-last', () => {
  expect(add(5)(10)).toEqual(15);
  expect(add(-5)(10)).toEqual(5);
});
