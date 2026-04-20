import { expectTypeOf, it } from 'vitest';
import { invert } from './invert';

declare const SYMBOL: unique symbol;

it('simple string records', () => {
  const result = invert({} as Record<string, string>);

  expectTypeOf(result).toEqualTypeOf<Record<string, string>>();
});

it('simple number records', () => {
  const result = invert({} as Record<number, number>);

  expectTypeOf(result).toEqualTypeOf<Record<number, `${number}`>>();
});

it('mixed const objects', () => {
  const result = invert({ a: 123, b: 'hello', 3: 456, 4: 'world' } as const);

  expectTypeOf(result).toEqualTypeOf<{
    123: 'a';
    hello: 'b';
    456: '3';
    world: '4';
  }>();
});

it('optional props', () => {
  const result = invert({} as { a?: 'hello'; b?: 123; 3?: 'world'; 4?: 456 });

  expectTypeOf(result).toEqualTypeOf<{
    hello?: 'a';
    123?: 'b';
    world?: '3';
    456?: '4';
  }>();
});

it('partial record', () => {
  const result = invert({} as Partial<Record<123 | 456, 'cat' | 'dog'>>);

  expectTypeOf(result).toEqualTypeOf<
    Partial<Record<'cat' | 'dog', '123' | '456'>>
  >();
});

it('symbol keys are filtered out', () => {
  const result = invert({ [SYMBOL]: 4, a: 'hello' } as const);

  expectTypeOf(result).toEqualTypeOf<{ hello: 'a' }>();
});

it('number keys are converted to strings', () => {
  const result = invert({ 1: 'a', 2: 'b' });

  expectTypeOf(result).toEqualTypeOf<Record<string, '1' | '2'>>();
});

it('symbol values are fine', () => {
  const result = invert({ a: SYMBOL } as const);

  expectTypeOf(result).toEqualTypeOf<{ [SYMBOL]: 'a' }>();
});

it('only symbol keys', () => {
  const result = invert({ [SYMBOL]: 4 });

  // eslint-disable-next-line ts/no-empty-object-type
  expectTypeOf(result).toEqualTypeOf<{}>();
});
