import { describe, expect, it } from 'vitest';
import {
  curryWithLazy1,
  curryWithLazy2,
  curryWithLazy3,
} from './curry-with-lazy-by-arity';

describe('data-first from the arity on', () => {
  it('curryWithLazy1', () => {
    expect(
      curryWithLazy1(
        collectArguments,
        lazyImplementation,
        1 /* argumentsLength */,
        ['data'],
      ),
    ).toStrictEqual([['data']]);
  });

  it('curryWithLazy1, undefined data is still data-first', () => {
    expect(
      curryWithLazy1(
        collectArguments,
        lazyImplementation,
        1 /* argumentsLength */,
        undefined,
      ),
    ).toStrictEqual([undefined]);
  });

  it('curryWithLazy2, an undefined argument is still data-first', () => {
    expect(
      curryWithLazy2(
        collectArguments,
        lazyImplementation,
        2 /* argumentsLength */,
        ['data'],
        undefined,
      ),
    ).toStrictEqual([['data'], undefined]);
  });

  it('curryWithLazy3, undefined arguments are still data-first', () => {
    expect(
      curryWithLazy3(
        collectArguments,
        lazyImplementation,
        3 /* argumentsLength */,
        ['data'],
        undefined,
        undefined,
      ),
    ).toStrictEqual([['data'], undefined, undefined]);
  });

  it('curryWithLazy1, more arguments than its arity', () => {
    expect(
      curryWithLazy1(
        collectArguments,
        lazyImplementation,
        2 /* argumentsLength */,
        ['data'],
      ),
    ).toStrictEqual([['data']]);
  });

  it('curryWithLazy2, more arguments than its arity', () => {
    expect(
      curryWithLazy2(
        collectArguments,
        lazyImplementation,
        3 /* argumentsLength */,
        ['data'],
        1,
      ),
    ).toStrictEqual([['data'], 1]);
  });

  it('curryWithLazy3, more arguments than its arity', () => {
    expect(
      curryWithLazy3(
        collectArguments,
        lazyImplementation,
        4 /* argumentsLength */,
        ['data'],
        1,
        2,
      ),
    ).toStrictEqual([['data'], 1, 2]);
  });
});

describe('data-last below the arity', () => {
  describe(curryWithLazy1, () => {
    it('declares a single parameter', () => {
      const dataLast = curryWithLazy1(
        collectArguments,
        lazyImplementation,
        0 /* argumentsLength */,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(dataLast).toHaveLength(1);
    });

    it('passes the data alone', () => {
      const dataLast = curryWithLazy1(
        collectArguments,
        lazyImplementation,
        0 /* argumentsLength */,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(
        typeof dataLast === 'function' &&
          dataLast(
            ['data'],
            // @ts-expect-error [ts2554] -- Intentional! A point-free caller passes extra arguments (`map` passes the index and the array), which the data-last function must not forward.
            'extra',
          ),
      ).toStrictEqual([['data']]);
    });

    it('carries the lazy implementation, with no argument for it', () => {
      const dataLast = curryWithLazy1(
        collectArguments,
        lazyImplementation,
        0 /* argumentsLength */,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(typeof dataLast === 'function' && dataLast.lazy).toBe(
        lazyImplementation,
      );
      expect(dataLast).toHaveProperty('lazyArgument', undefined);
    });
  });

  describe(curryWithLazy2, () => {
    it('declares a single parameter', () => {
      const dataLast = curryWithLazy2(
        collectArguments,
        lazyImplementation,
        1 /* argumentsLength */,
        1,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(dataLast).toHaveLength(1);
    });

    it('passes the data and the argument', () => {
      const dataLast = curryWithLazy2(
        collectArguments,
        lazyImplementation,
        1 /* argumentsLength */,
        1,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(
        typeof dataLast === 'function' &&
          dataLast(
            ['data'],
            // @ts-expect-error [ts2554] -- Intentional! A point-free caller passes extra arguments (`map` passes the index and the array), which the data-last function must not forward.
            'extra',
          ),
      ).toStrictEqual([['data'], 1]);
    });

    it('carries the lazy implementation, with the argument itself', () => {
      const dataLast = curryWithLazy2(
        collectArguments,
        lazyImplementation,
        1 /* argumentsLength */,
        1,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(typeof dataLast === 'function' && dataLast.lazy).toBe(
        lazyImplementation,
      );
      expect(typeof dataLast === 'function' && dataLast.lazyArgument).toBe(1);
    });
  });

  describe(curryWithLazy3, () => {
    it('declares a single parameter', () => {
      const dataLast = curryWithLazy3(
        collectArguments,
        lazyImplementation,
        2 /* argumentsLength */,
        1,
        2,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(dataLast).toHaveLength(1);
    });

    it('passes the data and both arguments', () => {
      const dataLast = curryWithLazy3(
        collectArguments,
        lazyImplementation,
        2 /* argumentsLength */,
        1,
        2,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(
        typeof dataLast === 'function' &&
          dataLast(
            ['data'],
            // @ts-expect-error [ts2554] -- Intentional! A point-free caller passes extra arguments (`map` passes the index and the array), which the data-last function must not forward.
            'extra',
          ),
      ).toStrictEqual([['data'], 1, 2]);
    });

    it('carries the lazy implementation, with the arguments as a tuple', () => {
      const dataLast = curryWithLazy3(
        collectArguments,
        lazyImplementation,
        2 /* argumentsLength */,
        1,
        2,
        undefined,
      );

      expect(dataLast).toBeTypeOf('function');
      expect(typeof dataLast === 'function' && dataLast.lazy).toBe(
        lazyImplementation,
      );
      expect(
        typeof dataLast === 'function' && dataLast.lazyArgument,
      ).toStrictEqual([1, 2]);
    });
  });
});

const collectArguments = (
  ...args: readonly [ReadonlyArray<unknown>, ...(ReadonlyArray<unknown>)]
): ReadonlyArray<unknown> => args;

function lazyImplementation(): never {
  throw new Error('Intentional! we don\'t run the evaluator in these tests');
}
