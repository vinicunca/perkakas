import { filter } from './filter';
import { isIncludedIn } from './is-included-in';
import { isNot } from './is-not';
import { pipe } from './pipe';
import { shuffle } from './shuffle';

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

function difference<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): Array<T> {
  return filter(a, isNot(isIncludedIn(b)));
}
