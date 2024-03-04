import { describe, expect, it } from 'vitest';

import { pipe } from '../function/pipe';
import { mapToObj } from './map-to-obj';

describe('data_first', () => {
  it('mapToObj', () => {
    const result = mapToObj([1, 2, 3] as const, (x) => [String(x), x * 2]);
    expect(result).toEqual({ 1: 2, 2: 4, 3: 6 });
  });
  it('mapToObj.indexed', () => {
    const result = mapToObj.indexed([0, 0, 0] as const, (_x, i) => [i, i]);
    expect(result).toEqual({ 0: 0, 1: 1, 2: 2 });
  });
});

describe('data_last', () => {
  it('mapToObj', () => {
    const result = pipe(
      [1, 2, 3] as const,
      mapToObj((x) => [String(x), x * 2]),
    );
    expect(result).toEqual({ 1: 2, 2: 4, 3: 6 });
  });
  it('mapToObj.indexed', () => {
    const result = pipe(
      [0, 0, 0] as const,
      mapToObj.indexed((_x, i) => [i, i]),
    );
    expect(result).toEqual({ 0: 0, 1: 1, 2: 2 });
  });
});
