import { expectTypeOf, it } from 'vitest';
import { pipe } from './pipe';
import { zipWith } from './zip-with';

it('data first typings', () => {
  const actual = zipWith(
    ['1', '2', '3'],
    ['a', 'b', 'c'],
    (a, b) => `${a}${b}`,
  );

  expectTypeOf(actual).toEqualTypeOf<Array<string>>();
});

it('data second typings', () => {
  const actual = zipWith((a: string, b: string) => `${a}${b}`)(
    ['1', '2', '3'],
    ['a', 'b', 'c'],
  );

  expectTypeOf(actual).toEqualTypeOf<Array<string>>();
});

it('data second with initial arg typings', () => {
  const actual = pipe(
    ['1', '2', '3'],
    zipWith(['a', 'b', 'c'], (a, b) => `${a}${b}`),
  );

  expectTypeOf(actual).toEqualTypeOf<Array<string>>();
});
