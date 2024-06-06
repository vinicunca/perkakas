import { dropLast } from './drop-last';

it('should drop last', () => {
  expect(dropLast([1, 2, 3, 4, 5], 2)).toStrictEqual([1, 2, 3]);
});

it('should not drop last', () => {
  expect(dropLast([1, 2, 3, 4, 5], 0)).toStrictEqual([1, 2, 3, 4, 5]);
  expect(dropLast([1, 2, 3, 4, 5], -0)).toStrictEqual([1, 2, 3, 4, 5]);
  expect(dropLast([1, 2, 3, 4, 5], -1)).toStrictEqual([1, 2, 3, 4, 5]);
  expect(dropLast([1, 2, 3, 4, 5], Number.NaN)).toStrictEqual([1, 2, 3, 4, 5]);
});

it('should return a new array even if there was no drop', () => {
  const data = [1, 2, 3, 4, 5];
  const result = dropLast(data, 0);
  expect(result).not.toBe(data);
  expect(result).toStrictEqual(data);
});
