import { expect, it } from 'vitest';
import { pipe } from './pipe';
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

it('a single item', () => {
  expect(takeLast([1], 1)).toStrictEqual([1]);
});

it('rounds a fractional n up', () => {
  expect(takeLast([1, 2, 3, 4, 5], 2.5)).toStrictEqual([3, 4, 5]);
});

it('a fraction below 1 takes one item', () => {
  expect(takeLast([1, 2, 3, 4, 5], 0.5)).toStrictEqual([5]);
});

it('a fraction too small to subtract from the length takes nothing', () => {
  // `length - n` rounds back to `length`, so the slice starts at the end.
  expect(takeLast([1, 2, 3, 4, 5], Number.MIN_VALUE)).toStrictEqual([]);
});

it('n is NaN', () => {
  expect(takeLast([1, 2, 3, 4, 5], NaN)).toStrictEqual([]);
});

it('n is Infinity', () => {
  expect(takeLast([1, 2, 3, 4, 5], Infinity)).toStrictEqual([1, 2, 3, 4, 5]);
});

it('n is -Infinity', () => {
  expect(takeLast([1, 2, 3, 4, 5], -Infinity)).toStrictEqual([]);
});

it('data-last on an empty array', () => {
  expect(pipe([], takeLast(2))).toStrictEqual([]);
});

it('data-last', () => {
  expect(pipe([1, 2, 3, 4, 5], takeLast(2))).toStrictEqual([4, 5]);
});
