import { expect, it } from 'vitest';
import { add } from './add';
import { constant } from './constant';
import { map } from './map';
import { pipe } from './pipe';
import { sliceString } from './slice-string';
import { times } from './times';

it('works', () => {
  const one = constant(1);

  expect(one()).toBe(1);
});

it('returns identity (doesn\'t clone)', () => {
  const obj = {} as { a?: boolean };
  const emptyObj = constant(obj);
  const firstInvocation = emptyObj();

  expect(firstInvocation).toStrictEqual({});
  expect(firstInvocation).toBe(obj);

  obj.a = true;

  expect(firstInvocation).toStrictEqual({ a: true });

  expect(emptyObj()).toStrictEqual({ a: true });
  expect(emptyObj()).toBe(obj);
});

it('works with more than one argument', () => {
  const one = constant(1);

  expect(one(1)).toBe(1);
  expect(one(1, 2)).toBe(1);
  expect(one(1, 2, 'a')).toBe(1);
  expect(one(undefined)).toBe(1);
  expect(one(['a'])).toBe(1);
});

it('works with variadic arguments', () => {
  const data = [1, 2, 3] as const;
  const one = constant('a');

  expect(one(...data)).toBe('a');
});

it('can be put in a pipe', () => {
  expect(pipe([1, 2, 3], constant([2, 3, 4]), map(add(1)))).toStrictEqual([
    3,
    4,
    5,
  ]);
});

it('can completely change the type of the pipe', () => {
  expect(pipe([1, 2, 3], constant('hello world'), sliceString(0, 4))).toBe(
    'hell',
  );
});

it('can be used as a fill function (with times)', () => {
  expect(times(10, constant('a'))).toStrictEqual([
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
  ]);
});
