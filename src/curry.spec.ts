import { expect, it } from 'vitest';
import { curry } from './curry';

function sub(a: number, b: number): number {
  return a - b;
}

function fn(...args: ReadonlyArray<unknown>): unknown {
  return curry(sub, args);
}

it('all arguments', () => {
  expect(fn(10, 5)).toBe(5);
});

it('1 missing', () => {
  const purried = fn(5) as (...args: ReadonlyArray<unknown>) => unknown;
  expect(purried(10)).toBe(5);
});

it('wrong number of arguments', () => {
  expect(() => fn(5, 10, 40)).toThrow('Wrong number of arguments');
});
