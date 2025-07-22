import { expect, it } from 'vitest';
import { add } from './add';
import { identity } from './identity';
import { map } from './map';
import { pipe } from './pipe';
import { times } from './times';

it('works', () => {
  const id = identity();
  expect(id('hello')).toBe('hello');
});

it('works with more than one argument', () => {
  const id = identity();
  expect(id(1)).toBe(1);
  expect(id(1, 2)).toBe(1);
  expect(id(1, 'a')).toBe(1);
  expect(id(undefined)).toBeUndefined();
});

it('works with variadic arguments', () => {
  const data = [1, 2, 3] as const;
  const id = identity();
  expect(id(...data)).toBe(data[0]);
});

it('can be put in a pipe', () => {
  expect(pipe([1, 2, 3], identity(), map(add(1)))).toStrictEqual([2, 3, 4]);
});

it('can be used as a fill function (with times)', () => {
  expect(times(10, identity())).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
