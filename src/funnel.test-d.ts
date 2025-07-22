/* eslint-disable ts/no-unused-vars -- We just want to build types, we don't care about using the params... */

import { describe, expectTypeOf, it } from 'vitest';
import { doNothing } from './do-nothing';
import { funnel } from './funnel';

describe('\'call\' method args', () => {
  it('no args', () => {
    const foo = funnel(doNothing(), {
      reducer: (_: 'test' | undefined) => 'test' as const,
      triggerAt: 'start',
    });

    expectTypeOf(foo.call).parameters.toEqualTypeOf<[]>();
  });

  it('non-optional args', () => {
    const foo = funnel(doNothing(), {
      // @ts-expect-error [ts(6133)] -- We want to use explicit names, not prefixed with _
      reducer: (_: 'test' | undefined, a: string, b: number, c: boolean) =>
        'test' as const,

      triggerAt: 'start',
    });

    expectTypeOf(foo.call).parameters.toEqualTypeOf<
      [a: string, b: number, c: boolean]
    >();
  });

  it('optional args', () => {
    const foo = funnel(doNothing(), {
      // @ts-expect-error [ts(6133)] -- We want to use explicit names, not prefixed with _
      reducer: (_: 'test' | undefined, a?: string) => 'test' as const,
      triggerAt: 'start',
    });

    expectTypeOf(foo.call).parameters.toEqualTypeOf<[a?: string | undefined]>();
  });

  it('rest args', () => {
    const foo = funnel(doNothing(), {
      reducer:
        // @ts-expect-error [ts(6133)] -- We want to use explicit names, not prefixed with _
        (_: 'test' | undefined, ...as: Array<string>) => 'test' as const,

      triggerAt: 'start',
    });

    expectTypeOf(foo.call).parameters.toEqualTypeOf<Array<string>>();
  });
});

describe('derive the reducer accumulator type from the executor param', () => {
  it('simple types', () => {
    funnel(
      (_: number) => {
        // do nothing
      },
      {
        reducer: (reduced) => {
          expectTypeOf(reduced).toEqualTypeOf<number | undefined>();

          return reduced!;
        },
        triggerAt: 'start',
      },
    );
  });

  it('arrays', () => {
    funnel(
      (_: ReadonlyArray<number>) => {
        // do nothing,
      },
      {
        reducer: (reduced) => {
          expectTypeOf(reduced).toEqualTypeOf<
            ReadonlyArray<number> | undefined
          >();

          return reduced!;
        },
        triggerAt: 'start',
      },
    );
  });

  it('objects', () => {
    funnel(
      (_: { readonly a: number }) => {
        // do nothing
      },
      {
        reducer: (reduced) => {
          expectTypeOf(reduced).toEqualTypeOf<
            { readonly a: number } | undefined
          >();

          return reduced!;
        },
        triggerAt: 'start',
      },
    );
  });
});

describe('prevent bad options', () => {
  it('minGapMs cannot be the only option with timing: end', () => {
    funnel(
      doNothing(),
      // @ts-expect-error [ts(2345)] -- minGapMs cannot be set alone]
      { minGapMs: 100 },
    );

    funnel(
      doNothing(),
      // @ts-expect-error [ts(2345)] -- minGapMs cannot be set alone]
      { triggerAt: 'end', minGapMs: 100 },
    );

    // But it works with "start" and "both"

    funnel(doNothing(), { triggerAt: 'start', minGapMs: 100 });
    funnel(doNothing(), { triggerAt: 'both', minGapMs: 100 });
  });
});
