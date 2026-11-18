import { describe, expect, it } from 'vitest';
import { pick } from './pick';
import { pipe } from './pipe';

it('dataFirst', () => {
  expect(pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd'])).toStrictEqual({
    a: 1,
    d: 4,
  });
});

it('dataLast', () => {
  expect(pipe({ a: 1, b: 2, c: 3, d: 4 }, pick(['a', 'd']))).toStrictEqual({
    a: 1,
    d: 4,
  });
});

it('it can pick symbol keys', () => {
  const mySymbol = Symbol('mySymbol');

  expect(pick({ [mySymbol]: 3, a: 4 }, [mySymbol])).toStrictEqual({
    [mySymbol]: 3,
  });
});

it('picking from non-existent keys (in a union)', () => {
  expect(pick({ a: 1 } as { a: number } | { b: string }, ['b'])).toStrictEqual(
    {},
  );
});

describe('`__proto__` key', () => {
  it('is an own property', () => {
    expect(
      Object.entries(
        pick({
          ['__proto__']: { hello: 'world' },
        }, ['__proto__']),
      ),
    ).toStrictEqual([
      [
        '__proto__',
        { hello: 'world' },
      ],
    ]);
  });

  it('keeps the prototype', () => {
    expect(
      Object.getPrototypeOf(pick({
        ['__proto__']: { a: 1 },
      }, ['__proto__'])),
    ).toBe(Object.prototype);
  });

  it('that isn\'t own isn\'t picked', () => {
    expect(
      Reflect.ownKeys(
        pick({ a: 1 } as Record<string, number>, ['a', '__proto__']),
      ),
    ).toStrictEqual(['a']);
  });
});
