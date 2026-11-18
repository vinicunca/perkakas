import { describe, expect, it } from 'vitest';
import { addProp } from './add-prop';
import { pipe } from './pipe';

describe('data first', () => {
  it('simple', () => {
    const actual = addProp({ a: 1 }, 'b', 2);

    expect(actual).toStrictEqual({ a: 1, b: 2 });
  });

  it('an undefined value', () => {
    expect(addProp({ a: 1 }, 'b', undefined)).toStrictEqual({
      a: 1,
      b: undefined,
    });
  });
});

describe('data last', () => {
  it('simple', () => {
    const actual = pipe({ a: 1 }, addProp('b', 2));

    expect(actual).toStrictEqual({ a: 1, b: 2 });
  });
});
