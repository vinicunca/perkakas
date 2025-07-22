import type { NTuple } from './n-tuple';
import { expectTypeOf, it } from 'vitest';

declare function nTuple<T, N extends number>(x: T, n: N): NTuple<T, N>;

it('size 0', () => {
  const result = nTuple('foo', 0);
  expectTypeOf(result).toEqualTypeOf<[]>();
});

it('non-trivial size', () => {
  const result = nTuple('foo', 3);
  expectTypeOf(result).toEqualTypeOf<[string, string, string]>();
});
