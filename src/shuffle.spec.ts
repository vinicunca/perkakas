import { difference } from './difference';
import { pipe } from './pipe';
import { shuffle } from './shuffle';

it('data-first', () => {
  const input = [4, 2, 7, 5] as const;

  const shuffled = shuffle(input);

  // Shuffled array has the same items
  expect(shuffled).toHaveLength(4);
  expect(difference(input, shuffled)).toHaveLength(0);
  expect(difference(shuffled, input)).toHaveLength(0);

  // Original array not mutated
  expect(shuffled).not.toBe(input);
  expect(input).toStrictEqual([4, 2, 7, 5]);
});

it('data-last', () => {
  const input = [4, 2, 7, 5] as const;

  const shuffled = pipe(input, shuffle());

  // Shuffled array has the same items
  expect(shuffled).toHaveLength(4);
  expect(difference(input, shuffled)).toHaveLength(0);
  expect(difference(shuffled, input)).toHaveLength(0);

  // Original array not mutated
  expect(shuffled).not.toBe(input);
  expect(input).toStrictEqual([4, 2, 7, 5]);
});
