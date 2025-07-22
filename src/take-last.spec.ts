import { expect, it } from 'vitest';
import { takeLast } from './take-last';

it('empty array', () => {
  expect(takeLast([], 2)).toStrictEqual([]);
});

it('n < 0', () => {
  expect(takeLast([1, 2, 3, 4, 5], -1)).toStrictEqual([]);
});

it('n === 0', () => {
  expect(takeLast([1, 2, 3, 4, 5], 0)).toStrictEqual([]);
});

it('n < length', () => {
  expect(takeLast([1, 2, 3, 4, 5], 2)).toStrictEqual([4, 5]);
});

it('n === length', () => {
  expect(takeLast([1, 2, 3, 4, 5], 5)).toStrictEqual([1, 2, 3, 4, 5]);
});

it('n > length', () => {
  expect(takeLast([1, 2, 3, 4, 5], 10)).toStrictEqual([1, 2, 3, 4, 5]);
});

it('should return a new array even if everything was taken', () => {
  const data = [1, 2, 3, 4, 5];
  const result = takeLast(data, data.length);
  expect(result).not.toBe(data);
  expect(result).toStrictEqual(data);
});
