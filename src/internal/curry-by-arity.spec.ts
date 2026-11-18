import { describe, expect, it } from 'vitest';
import { curry1, curry2, curry3 } from './curry-by-arity';

describe('data-first from the arity on', () => {
  it('curry1', () => {
    expect(
      curry1(collectArguments, 1 /* argumentsLength */, 'data'),
    ).toStrictEqual(['data']);
  });

  it('curry1, undefined data is still data-first', () => {
    expect(
      curry1(collectArguments, 1 /* argumentsLength */, undefined),
    ).toStrictEqual([undefined]);
  });

  it('curry2, an undefined argument is still data-first', () => {
    expect(
      curry2(collectArguments, 2 /* argumentsLength */, 'data', undefined),
    ).toStrictEqual(['data', undefined]);
  });

  it('curry3, undefined arguments are still data-first', () => {
    expect(
      curry3(
        collectArguments,
        3 /* argumentsLength */,
        'data',
        undefined,
        undefined,
      ),
    ).toStrictEqual(['data', undefined, undefined]);
  });

  it('curry1, more arguments than its arity', () => {
    expect(
      curry1(collectArguments, 2 /* argumentsLength */, 'data'),
    ).toStrictEqual(['data']);
  });

  it('curry2, more arguments than its arity', () => {
    expect(
      curry2(collectArguments, 3 /* argumentsLength */, 'data', 1),
    ).toStrictEqual(['data', 1]);
  });

  it('curry3, more arguments than its arity', () => {
    expect(
      curry3(collectArguments, 4 /* argumentsLength */, 'data', 1, 2),
    ).toStrictEqual(['data', 1, 2]);
  });
});

describe('data-last below the arity', () => {
  it('curry1, the implementation itself', () => {
    expect(curry1(collectArguments, 0 /* argumentsLength */, undefined)).toBe(
      collectArguments,
    );
  });

  describe(curry2, () => {
    it('declares a single parameter', () => {
      const dataLast = curry2(
        collectArguments,
        1 /* argumentsLength */,
        1,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(dataLast).toHaveLength(1);
    });

    it('passes the data and the argument', () => {
      const dataLast = curry2(
        collectArguments,
        1 /* argumentsLength */,
        1,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(
        typeof dataLast === 'function'
        && dataLast(
          'data',
          // @ts-expect-error [ts2554] -- Intentional! A point-free caller passes extra arguments (`map` passes the index and the array), which the data-last function must not forward.
          'extra',
        ),
      ).toStrictEqual(['data', 1]);
    });
  });

  describe(curry3, () => {
    it('declares a single parameter', () => {
      const dataLast = curry3(
        collectArguments,
        2 /* argumentsLength */,
        1,
        2,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(dataLast).toHaveLength(1);
    });

    it('passes the data and both arguments', () => {
      const dataLast = curry3(
        collectArguments,
        2 /* argumentsLength */,
        1,
        2,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(
        typeof dataLast === 'function'
        && dataLast(
          'data',
          // @ts-expect-error [ts2554] -- Intentional! A point-free caller passes extra arguments (`map` passes the index and the array), which the data-last function must not forward.
          'extra',
        ),
      ).toStrictEqual(['data', 1, 2]);
    });
  });
});

function collectArguments(...args: ReadonlyArray<unknown>): ReadonlyArray<unknown> {
  return args;
}
