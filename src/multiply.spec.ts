import { multiply } from './multiply';

it('data-first', () => {
  expect(multiply(3, 4)).toBe(12);
});

it('data-last', () => {
  expect(multiply(4)(3)).toBe(12);
});
