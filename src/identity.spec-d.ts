import { expectTypeOf, it } from 'vitest';
import { identity } from './identity';

it('normal values', () => {
  const id = identity();
  expectTypeOf(id('hello')).toEqualTypeOf<string>();
  expectTypeOf(id(123)).toEqualTypeOf<number>();
  expectTypeOf(id(true)).toEqualTypeOf<boolean>();
  expectTypeOf(id({ a: 1, b: 'hello' })).toEqualTypeOf<{
    a: number;
    b: string;
  }>();
});

it('literal values', () => {
  const id = identity();
  expectTypeOf(id('hello' as const)).toEqualTypeOf<'hello'>();
  expectTypeOf(id(123 as const)).toEqualTypeOf<123>();
  expectTypeOf(id(true as const)).toEqualTypeOf<true>();
  expectTypeOf(id({ a: 1, b: 'hello' } as const)).toEqualTypeOf<{
    readonly a: 1;
    readonly b: 'hello';
  }>();
});

it('complex variadic invocations', () => {
  const data = ['a', true, 123] as const;
  const id = identity();
  expectTypeOf(id(...data)).toEqualTypeOf<'a'>();
});

it('supported in any api', () => {
  mockApi({
    onMixOfParams: identity(),
    onVariadicParams: identity(),
  });
});

it('requires at least one argument', () => {
  mockApi({
    onMixOfParams: identity(),
    onVariadicParams: identity(),
    // @ts-expect-error [ts2322] - identity requires at least one param to be passed, it doesn't default to `undefined`
    onNoParams: identity(),
  });
});

function mockApi(_options: {
  readonly onMixOfParams: (result: number, isOptionalBoolean?: true) => number;
  readonly onVariadicParams: (...args: ReadonlyArray<'cat' | 'dog'>) => string;
  readonly onNoParams?: () => boolean;
}): void {
  /* do nothing */
}
