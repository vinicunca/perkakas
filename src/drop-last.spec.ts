import { expect, it } from 'vitest';
import { dropLast } from './drop-last';

it('empty array', () => {
  expect(dropLast([], 2)).toStrictEqual([]);
});

it('n < 0', () => {
  expect(dropLast([1, 2, 3, 4, 5], -1)).toStrictEqual([1, 2, 3, 4, 5]);
});

it('n === 0', () => {
  expect(dropLast([1, 2, 3, 4, 5], 0)).toStrictEqual([1, 2, 3, 4, 5]);
});

it('n < length', () => {
  expect(dropLast([1, 2, 3, 4, 5], 2)).toStrictEqual([1, 2, 3]);
});

it('n === length', () => {
  expect(dropLast([1, 2, 3, 4, 5], 5)).toStrictEqual([]);
});

it('n > length', () => {
  expect(dropLast([1, 2, 3, 4, 5], 10)).toStrictEqual([]);
});

it('should return a new array even if there was no drop', () => {
  const data = [1, 2, 3, 4, 5];
  const result = dropLast(data, 0);
  expect(result).not.toBe(data);
  expect(result).toStrictEqual(data);
});
