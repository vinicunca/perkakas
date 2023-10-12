import { describe, expect, it } from 'vitest';
import { pipe } from '../function';
import { shuffle } from './shuffle';
import { difference } from './difference';

describe('data_first', () => {
  it('shuffle', () => {
    const input = [4, 2, 7, 5] as const;

    const shuffled = shuffle(input);

    // Shuffled array has the same items
    expect(shuffled.length).toEqual(4);
    expect(difference(input, shuffled).length).toEqual(0);
    expect(difference(shuffled, input).length).toEqual(0);

    // Original array not mutated
    expect(input).toEqual([4, 2, 7, 5]);
  });
});

describe('data_last', () => {
  it('shuffle', () => {
    const input = [4, 2, 7, 5] as const;

    const shuffled = pipe(input, shuffle());

    // Shuffled array has the same items
    expect(shuffled.length).toEqual(4);
    expect(difference(input, shuffled).length).toEqual(0);
    expect(difference(shuffled, input).length).toEqual(0);

    // Original array not mutated
    expect(input).toEqual([4, 2, 7, 5]);
  });
});
