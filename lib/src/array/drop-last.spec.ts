import { expect, it } from 'vitest';
import { dropLast } from './drop-last';

const arr = [1, 2, 3, 4, 5] as const;

it('should drop last', () => {
  expect(dropLast(arr, 2)).toEqual([1, 2, 3]);
});

it('should not drop last', () => {
  expect(dropLast(arr, 0)).toEqual(arr);
  expect(dropLast(arr, -0)).toEqual(arr);
  expect(dropLast(arr, -1)).toEqual(arr);
  expect(dropLast(arr, Number.NaN)).toEqual(arr);
});

it('should return a new array even if there was no drop', () => {
  expect(dropLast(arr, 0)).not.toBe(arr);
});
