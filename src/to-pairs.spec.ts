import { assertType, expect, it } from 'vitest';

import { toPairs } from './to-pairs';

it('should return pairs', () => {
  const actual = toPairs({ a: 1, b: 2, c: 3 });
  expect(actual).toEqual([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
});

it('should return pairs, strict', () => {
  const actual = toPairs.strict({ a: 1, b: 2, c: 3 });
  expect(actual).toEqual([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
});

it('stricter typing', () => {
  const actual = toPairs.strict({ a: 1, b: 2, c: 3 } as const);
  assertType<Array<['a' | 'b' | 'c', 1 | 2 | 3]>>(actual);
});

it('stricter typing with optional', () => {
  const actual = toPairs.strict({} as { a?: string });
  assertType<Array<['a', string]>>(actual);
});

it('stricter typing with undefined', () => {
  const actual = toPairs.strict({ a: undefined } as { a: string | undefined });
  assertType<Array<['a', string | undefined]>>(actual);
});

it('stricter with a broad type', () => {
  const actual = toPairs.strict({ a: 1, b: 2, c: 3 } as Record<
  string,
  unknown
  >);

  assertType<Array<[string, unknown]>>(actual);
});
