import { describe, expectTypeOf, it } from 'vitest';
import { randomBigInt } from './random-big-int';

describe('known limitations!', () => {
  it('doesn\'t return never on invalid range', () => {
    // @ts-expect-error [ts2554] - We can't detect these cases with TypeScript.
    expectTypeOf(randomBigInt(10n, 0n)).toEqualTypeOf<never>();
  });
});
