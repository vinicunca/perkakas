import { expectTypeOf, test } from 'vitest';
import { doNothing } from './do-nothing';
import { forEach } from './for-each';
import { pipe } from './pipe';

test('doesn\'t return anything on dataFirst invocations', () => {
  const result = forEach([1, 2, 3], doNothing());

  expectTypeOf(result).toEqualTypeOf<void>();
});

test('passes the item type to the callback', () => {
  pipe(
    [1, 2, 3] as const,
    forEach((x) => {
      expectTypeOf(x).toEqualTypeOf<1 | 2 | 3>();
    }),
  );
});

test('maintains the array shape', () => {
  const data = [1, 'a'] as [1 | 2, 'a' | 'b', ...Array<boolean>];

  pipe(data, forEach(doNothing()), (x) => {
    expectTypeOf(x).toEqualTypeOf<[1 | 2, 'a' | 'b', ...Array<boolean>]>();
  });
});

test('makes the result mutable', () => {
  const data = [] as ReadonlyArray<number>;

  pipe(data, forEach(doNothing()), (x) => {
    expectTypeOf(x).toEqualTypeOf<Array<number>>();
  });
});

test('data param is complete in data-first', () => {
  forEach([1, 2, 3] as const, (_value, _index, data) => {
    expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();
  });
});

test('data param is lazily reconstructed in data-last', () => {
  pipe(
    [1, 2, 3] as const,
    forEach((_value, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();
    }),
  );
});
