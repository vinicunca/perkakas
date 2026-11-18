import { expect, it, vi } from 'vitest';
import { constant } from './constant';
import { pipe } from './pipe';
import { splitWhen } from './split-when';

it('should split array', () => {
  expect(splitWhen([1, 2, 3, 1, 2, 3] as const, (x) => x === 2)).toStrictEqual([
    [1],
    [2, 3, 1, 2, 3],
  ]);
});

it('should with no matches', () => {
  const n = 1232;

  expect(splitWhen([1, 2, 3, 1, 2, 3], (x) => x === n)).toStrictEqual([
    [1, 2, 3, 1, 2, 3],
    [],
  ]);
});

it('empty array', () => {
  expect(splitWhen([], constant(true))).toStrictEqual([[], []]);
});

it('single item that matches', () => {
  expect(splitWhen([1], constant(true))).toStrictEqual([
    [],
    [1],
  ]);
});

it('single item that doesn\'t match', () => {
  expect(splitWhen([1], constant(false))).toStrictEqual([
    [1],
    [],
  ]);
});

it('calls the predicate in order with the whole input, up to the first match', () => {
  const data = ['a', 'b', 'c', 'd'];
  const predicate = vi.fn<
    (item: string, index: number, data: ReadonlyArray<string>) => boolean
  >((item) => item === 'b');

  splitWhen(data, predicate);

  expect(predicate.mock.calls).toStrictEqual([
    ['a', 0, data],
    ['b', 1, data],
  ]);
});

it('calls the predicate once per item when nothing matches', () => {
  const data = ['a', 'b', 'c'];
  const predicate = vi.fn<
    (item: string, index: number, data: ReadonlyArray<string>) => boolean
  >(constant(false));

  splitWhen(data, predicate);

  expect(predicate.mock.calls).toStrictEqual([
    ['a', 0, data],
    ['b', 1, data],
    ['c', 2, data],
  ]);
});

it('empty array in a pipe', () => {
  expect(pipe([], splitWhen(constant(true)))).toStrictEqual([[], []]);
});

it('in a pipe', () => {
  expect(
    pipe(
      [1, 2, 3],
      splitWhen((x) => x === 2),
    ),
  ).toStrictEqual([[1], [2, 3]]);
});
