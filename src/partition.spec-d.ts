import { expectTypeOf, it } from 'vitest';
import { isNumber } from './is-number';
import { partition } from './partition';
import { pipe } from './pipe';

it('partition with type guard', () => {
  const actual = partition([1, 'a', 2, 'b'], isNumber);
  expectTypeOf(actual).toEqualTypeOf<[Array<number>, Array<string>]>();
});

it('partition with type guard in pipe', () => {
  const actual = pipe(
    [1, 'a', 2, 'b'],
    partition((value): value is number => typeof value === 'number'),
  );
  expectTypeOf(actual).toEqualTypeOf<[Array<number>, Array<string>]>();
});
