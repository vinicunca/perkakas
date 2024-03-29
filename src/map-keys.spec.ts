import { describe, expect, it } from 'vitest';

import { mapKeys } from './map-keys';
import { pipe } from './pipe';

describe('data first', () => {
  it('mapKeys', () => {
    expect(
      mapKeys(
        {
          a: 1,
          b: 2,
        },
        (key, value) => `${key}${value}`,
      ),
    ).toEqual({
      a1: 1,
      b2: 2,
    });
  });
});

describe('data last', () => {
  it('mapKeys', () => {
    expect(
      pipe(
        {
          a: 1,
          b: 2,
        },
        mapKeys((key, value) => `${key}${value}`),
      ),
    ).toEqual({
      a1: 1,
      b2: 2,
    });
  });
});
