import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { split } from './split';

it('empty string, empty separator', () => {
  expect(split('', '')).toStrictEqual([]);
});

it('empty string, non-empty separator', () => {
  expect(split('', ',')).toStrictEqual(['']);
});

it('trivial split', () => {
  expect(split('a', ',')).toStrictEqual(['a']);
});

it('string contains separator', () => {
  expect(split(',', ',')).toStrictEqual(['', '']);
});

it('useful split', () => {
  expect(split('a,b,c', ',')).toStrictEqual(['a', 'b', 'c']);
});

it('regex split', () => {
  expect(split('a,b,c', /,/u)).toStrictEqual(['a', 'b', 'c']);
});

it('multiple types of separators', () => {
  expect(split('a,b;c', /[;,]/u)).toStrictEqual(['a', 'b', 'c']);
});

it('regex with limit', () => {
  expect(split('a,b,c', /,/u, 2)).toStrictEqual(['a', 'b']);
});

it('limited split', () => {
  expect(split('a,b,c', ',', 2)).toStrictEqual(['a', 'b']);
});

it('limit is higher than splits', () => {
  expect(split('a,b,c', ',', 5)).toStrictEqual(['a', 'b', 'c']);
});

it('multiple consecutive separators', () => {
  expect(split('a,,b', ',')).toStrictEqual(['a', '', 'b']);
});

it('separator at the start and end', () => {
  expect(split(',a,b,', ',')).toStrictEqual(['', 'a', 'b', '']);
});

it('empty-string separator', () => {
  expect(split('abcdef', '')).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
});

it('undefined limit', () => {
  expect(split('a,b,c', ',')).toStrictEqual(['a', 'b', 'c']);
});

it('negative limit', () => {
  expect(split('a,b,c', ',', -1)).toStrictEqual(['a', 'b', 'c']);
});

it('fractional limits', () => {
  expect(split('a,b,c', ',', 1.5)).toStrictEqual(['a']);
});

it('0 limit', () => {
  expect(split('a,b,c', ',', 0)).toStrictEqual([]);
});

describe('dataLast', () => {
  it('useful split', () => {
    expect(pipe('a,b,c', split(','))).toStrictEqual(['a', 'b', 'c']);
  });

  it('regex split', () => {
    expect(pipe('a,b,c', split(/,/u))).toStrictEqual(['a', 'b', 'c']);
  });

  it('limited split', () => {
    expect(pipe('a,b,c', split(',', 2))).toStrictEqual(['a', 'b']);
  });

  it('regex with limit', () => {
    expect(pipe('a,b,c', split(/,/u, 2))).toStrictEqual(['a', 'b']);
  });

  it('undefined limit', () => {
    expect(pipe('a,b,c', split(',', undefined))).toStrictEqual(['a', 'b', 'c']);
  });
});
