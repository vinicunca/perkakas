import { expect, it } from 'vitest';
import { concat } from './concat';
import { pick } from './pick';
import { pipe } from './pipe';

it('dataFirst', () => {
  const result = pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']);

  expect(result).toStrictEqual({ a: 1, d: 4 });
});

it('dataLast', () => {
  const result = pipe({ a: 1, b: 2, c: 3, d: 4 }, pick(['a', 'd']));

  expect(result).toStrictEqual({ a: 1, d: 4 });
});

it('read only', () => {
  concat([1, 2], [3, 4] as const);
  // or similar:
  // const props: ReadonlyArray<string> = ["prop1", "prop2"];
  // const getProps = <T extends string>(props: readonly T[]) => props;
  const someObject = { prop1: 'a', prop2: 2, a: 'b' };
  const props = ['prop1', 'prop2'] as const;
  pick(someObject, props); // TS2345 compilation error
});

it('it can pick symbol keys', () => {
  const mySymbol = Symbol('mySymbol');
  expect(pick({ [mySymbol]: 3, a: 4 }, [mySymbol])).toStrictEqual({
    [mySymbol]: 3,
  });
});
