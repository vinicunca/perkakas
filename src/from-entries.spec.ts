import { expect, it } from 'vitest';
import { fromEntries } from './from-entries';
import { pipe } from './pipe';

it('dataFirst', () => {
  expect(
    fromEntries([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]),
  ).toStrictEqual({ a: 1, b: 2, c: 3 });
});

it('dataLast', () => {
  expect(
    pipe(
      [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ] as const,
      fromEntries(),
    ),
  ).toStrictEqual({ a: 1, b: 2, c: 3 });
});

it('empty array', () => {
  expect(fromEntries([])).toStrictEqual({});
});

it('single entry', () => {
  expect(fromEntries([['a', 1]])).toStrictEqual({ a: 1 });
});

it('boolean values', () => {
  expect(
    fromEntries([
      ['hello', true],
      ['world', false],
    ]),
  ).toStrictEqual({ hello: true, world: false });
});

it('string values', () => {
  expect(fromEntries([['a', 'd']])).toStrictEqual({ a: 'd' });
});

it('number keys and values', () => {
  expect(fromEntries([[1, 123]])).toStrictEqual({ 1: 123 });
});
