import { expect, it } from 'vitest';
import { map } from './map';
import { multiply } from './multiply';
import { piped } from './piped';
import { take } from './take';

it('should pipe a single operation', () => {
  const fn = piped((x: number) => x * 2);

  expect(fn(1)).toBe(2);
});

it('should pipe operations', () => {
  const fn = piped(
    (x: number) => x * 2,
    (x) => x * 3,
  );

  expect(fn(1)).toBe(6);
});

it('reused as the only lazy step, starts fresh on every run', () => {
  expect(
    map(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      piped(take(2)),
    ),
  ).toStrictEqual([
    [1, 2],
    [4, 5],
  ]);
});

it('reused among several fused lazy steps, starts fresh on every run', () => {
  expect(
    map(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      piped(map(multiply(10)), take(2)),
    ),
  ).toStrictEqual([
    [10, 20],
    [40, 50],
  ]);
});
