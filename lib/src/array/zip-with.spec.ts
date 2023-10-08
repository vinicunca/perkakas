import { assertType, describe, expect, it } from 'vitest';
import { zipWith } from './zip-with';

function pred(a: string, b: string) {
  return a + b;
}

const first = ['1', '2', '3'];
const second = ['a', 'b', 'c'];
const shorterFirst = ['1', '2'];
const shorterSecond = ['a', 'b'];

describe('data first', () => {
  it('should zip with predicate', () => {
    expect(zipWith(first, second, pred)).toEqual(['1a', '2b', '3c']);
  });
  it('should truncate to shorter second', () => {
    expect(zipWith(first, shorterSecond, pred)).toEqual(['1a', '2b']);
  });
  it('should truncate to shorter first', () => {
    expect(zipWith(shorterFirst, second, pred)).toEqual(['1a', '2b']);
  });
});

describe('data first typings', () => {
  it('infers typing from predicate', () => {
    const actual = zipWith(first, second, pred);
    assertType<Array<string>>(actual);
  });
});

describe('data second', () => {
  it('should zip with predicate', () => {
    expect(zipWith(pred)(first, second)).toEqual(['1a', '2b', '3c']);
  });
  it('should truncate to shorter second', () => {
    expect(zipWith(pred)(first, shorterSecond)).toEqual(['1a', '2b']);
  });
  it('should truncate to shorter first', () => {
    expect(zipWith(pred)(shorterFirst, second)).toEqual(['1a', '2b']);
  });
});

describe('data second typings', () => {
  it('infers typing from predicate', () => {
    const actual = zipWith(pred)(first, second);
    assertType<Array<string>>(actual);
  });
});

describe('data second with initial arg', () => {
  it('should zip with predicate', () => {
    expect(zipWith(pred, second)(first)).toEqual(['1a', '2b', '3c']);
  });
  it('should truncate to shorter second', () => {
    expect(zipWith(pred, shorterSecond)(first)).toEqual(['1a', '2b']);
  });
  it('should truncate to shorter first', () => {
    expect(zipWith(pred, second)(shorterFirst)).toEqual(['1a', '2b']);
  });
});

describe('data second with initial arg typings', () => {
  it('infers typing from predicate', () => {
    const actual = zipWith(pred, second)(first);
    assertType<Array<string>>(actual);
  });
});
