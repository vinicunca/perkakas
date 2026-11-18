import { describe, expect, it } from 'vitest';
import { objOf } from './obj-of';

describe('data first', () => {
  it('wrap value', () => {
    const actual = objOf(10, 'a');

    expect(actual.a).toBe(10);
    expect(actual).toStrictEqual({ a: 10 });
  });

  it('an undefined value', () => {
    expect(objOf(undefined, 'a')).toStrictEqual({ a: undefined });
  });
});

describe('data last', () => {
  it('wrap value', () => {
    const actual = objOf('a')(10);

    expect(actual.a).toBe(10);
    expect(actual).toStrictEqual({ a: 10 });
  });
});
