import { expect, it } from 'vitest';
import { omit } from './omit';
import { pipe } from './pipe';

it('dataFirst', () => {
  const result = omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd'] as const);

  expect(result).toStrictEqual({ b: 2, c: 3 });
});

it('single removed prop works', () => {
  const obj: { a: number } = { a: 1 };
  const result = omit(obj, ['a']);

  expect(result).toStrictEqual({});
});

it('dataLast', () => {
  const result = pipe({ a: 1, b: 2, c: 3, d: 4 }, omit(['a', 'd'] as const));

  expect(result).toStrictEqual({ b: 2, c: 3 });
});

it('can omit symbol keys', () => {
  const mySymbol = Symbol('mySymbol');
  expect(omit({ [mySymbol]: 3 }, [mySymbol])).toStrictEqual({});
});

it('shallow clone the array when there\'s nothing to omit', () => {
  const obj = { a: 1, b: 2, c: 3, d: 4 };
  const result = omit(obj, []);
  expect(result).toStrictEqual(obj);
  expect(result).not.toBe(obj);
});
