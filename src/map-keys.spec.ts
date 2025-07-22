import { expect, it } from 'vitest';
import { constant } from './constant';
import { mapKeys } from './map-keys';
import { pipe } from './pipe';

it('dataFirst', () => {
  expect(
    mapKeys({ a: 1, b: 2 }, (key, value) => `${key}${value}`),
  ).toStrictEqual({ a1: 1, b2: 2 });
});

it('dataLast', () => {
  expect(
    pipe(
      { a: 1, b: 2 },
      mapKeys((key, value) => `${key}${value}`),
    ),
  ).toStrictEqual({ a1: 1, b2: 2 });
});

it('symbols are filtered out', () => {
  expect(mapKeys({ [Symbol('mySymbol')]: 1 }, constant(3))).toStrictEqual({});
});

it('symbols are not passed to the mapper', () => {
  mapKeys({ [Symbol('mySymbol')]: 1, a: 'hello' }, (key, value) => {
    expect(key).toBe('a');
    expect(value).toBe('hello');
    return key;
  });
});

it('symbols returned from the mapper are not ignored', () => {
  const mySymbol = Symbol('mySymbol');
  expect(mapKeys({ a: 1 }, constant(mySymbol))).toStrictEqual({
    [mySymbol]: 1,
  });
});

it('number keys are converted to strings', () => {
  mapKeys({ 123: 456 }, (key, value) => {
    expect(key).toBe('123');
    expect(value).toBe(456);
    return key;
  });
});

it('numbers returned from the mapper are used as-is', () => {
  expect(mapKeys({ a: 'b' }, constant(123))).toStrictEqual({ 123: 'b' });
});
