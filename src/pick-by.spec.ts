import { describe, expect, it, vi } from 'vitest';
import { constant } from './constant';
import { pickBy } from './pick-by';
import { pipe } from './pipe';

it('dataFirst', () => {
  expect(
    pickBy({ a: 1, b: 2, A: 3, B: 4 }, (_, key) => key.toUpperCase() === key),
  ).toStrictEqual({ A: 3, B: 4 });
});

it('dataLast', () => {
  expect(
    pipe(
      { a: 1, b: 2, A: 3, B: 4 },
      pickBy((_, key) => key.toUpperCase() === key),
    ),
  ).toStrictEqual({ A: 3, B: 4 });
});

it('symbols are filtered out', () => {
  const mySymbol = Symbol('mySymbol');

  expect(pickBy({ [mySymbol]: 1 }, constant(true))).toStrictEqual({});
});

it('symbols are not passed to the predicate', () => {
  const mock = vi.fn<(x: string) => boolean>();
  const data = { [Symbol('mySymbol')]: 1, a: 'hello' };
  pickBy(data, mock);

  expect(mock).toHaveBeenCalledExactlyOnceWith('hello', 'a', data);
});

describe('`__proto__` key', () => {
  it('is an own property', () => {
    expect(
      Object.entries(
        pickBy({ ['__proto__']: { hello: 'world' } }, constant(true)),
      ),
    ).toStrictEqual([['__proto__', { hello: 'world' }]]);
  });

  it('keeps the prototype', () => {
    expect(
      Object.getPrototypeOf(
        pickBy({ ['__proto__']: { a: 1 } }, constant(true)),
      ),
    ).toBe(Object.prototype);
  });
});
