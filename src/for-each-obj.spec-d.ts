import { expectTypeOf, it } from 'vitest';
import { forEachObj } from './for-each-obj';
import { pipe } from './pipe';

declare const SYMBOL: unique symbol;

it('typing is sound when only symbol keys', () => {
  forEachObj({ [SYMBOL]: 4 }, (value, key) => {
    expectTypeOf(key).toBeNever();
    expectTypeOf(value).toBeNever();
  });
});

it('symbol keys are ignored', () => {
  forEachObj({ [SYMBOL]: 4, a: 'hello', b: true }, (value, key) => {
    expectTypeOf(key).toEqualTypeOf<'a' | 'b'>();
    expectTypeOf(value).toEqualTypeOf<boolean | string>();
  });
});

it('number keys are translated to strings', () => {
  forEachObj({ 123: 'hello', 456: true }, (value, key) => {
    expectTypeOf(key).toEqualTypeOf<'123' | '456'>();
    expectTypeOf(value).toEqualTypeOf<boolean | string>();
  });
});

it('union of records', () => {
  const data = {} as Record<number, string> | Record<string, number>;

  forEachObj(data, (value, key) => {
    expectTypeOf(key).toEqualTypeOf<string>();
    expectTypeOf(value).toEqualTypeOf<number | string>();
  });

  pipe(
    data,
    forEachObj((value, key) => {
      expectTypeOf(key).toEqualTypeOf<string>();
      expectTypeOf(value).toEqualTypeOf<number | string>();
    }),
  );
});
