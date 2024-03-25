import { describe, expect, it } from 'vitest';

import { mapValues } from './map-values';
import { pipe } from './pipe';

describe('data first', () => {
  it('mapValues', () => {
    expect(
      mapValues(
        {
          a: 1,
          b: 2,
        },
        (value, key) => `${value}${key}`,
      ),
    ).toEqual({
      a: '1a',
      b: '2b',
    });
  });
});

describe('data last', () => {
  it('mapValues', () => {
    expect(
      pipe(
        {
          a: 1,
          b: 2,
        },
        mapValues((value, key) => `${value}${key}`),
      ),
    ).toEqual({
      a: '1a',
      b: '2b',
    });
  });
});
