import { expect, it } from 'vitest';
import { partialLastBind } from './partial-last-bind';

const fn = (x: number, y: number, z: number): string => `${x}, ${y}, and ${z}`;

it('should partially apply 0 args', () => {
  expect(partialLastBind(fn)(1, 2, 3)).toBe(fn(1, 2, 3));
});

it('should partially apply 1 arg', () => {
  expect(partialLastBind(fn, 3)(1, 2)).toBe(fn(1, 2, 3));
});

it('should partially apply all args', () => {
  expect(partialLastBind(fn, 1, 2, 3)()).toBe(fn(1, 2, 3));
});
