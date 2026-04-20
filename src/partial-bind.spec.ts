import { expect, it } from 'vitest';
import { partialBind } from './partial-bind';

const fn = (x: number, y: number, z: number): string => `${x}, ${y}, and ${z}`;

it('should partially apply 0 args', () => {
  expect(partialBind(fn)(1, 2, 3)).toBe(fn(1, 2, 3));
});

it('should partially apply 1 arg', () => {
  expect(partialBind(fn, 1)(2, 3)).toBe(fn(1, 2, 3));
});

it('should partially apply all args', () => {
  expect(partialBind(fn, 1, 2, 3)()).toBe(fn(1, 2, 3));
});
