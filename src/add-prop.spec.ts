import { describe, expect, it } from 'vitest';

import { pipe } from '../pipe';
import { addProp } from './add-prop';

describe('data first', () => {
  it('addProp', () => {
    const actual = addProp({ a: 1 }, 'b', 2);
    expect(actual).toEqual({ a: 1, b: 2 });
  });
});

describe('data last', () => {
  it('addProp', () => {
    const actual = pipe({ a: 1 }, addProp('b', 2));
    expect(actual).toEqual({ a: 1, b: 2 });
  });
});
