import { describe, expectTypeOf, it } from 'vitest';
import { countBy } from './count-by';
import { pipe } from './pipe';

describe('dataFirst', () => {
  it('countBy', () => {
    const data = ['a', 'b', 'c', 'B', 'A', 'a'];
    const result = countBy(data, (x) => x.toLowerCase());

    expectTypeOf(result).toEqualTypeOf<Record<string, number>>();
  });
});

describe('dataLast', () => {
  it('countBy', () => {
    const data = ['a', 'b', 'c', 'B', 'A', 'a'];
    const result = pipe(
      data,
      countBy((x) => x.toLowerCase()),
    );

    expectTypeOf(result).toEqualTypeOf<Record<string, number>>();
  });
});

it('callback function type', () => {
  const data = [1, 2, 3];
  countBy(data, (x) => {
    expectTypeOf(x).toEqualTypeOf<number>();
    return x;
  });
});

it('literal unions', () => {
  const data = [] as Array<'cat' | 'dog'>;
  const result = countBy(data, (x) => x);

  expectTypeOf(result).toEqualTypeOf<Partial<Record<'cat' | 'dog', number>>>();
});
