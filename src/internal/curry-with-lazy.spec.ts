import type { LazyDefinition } from './lazy-data-last-implementation';
import { describe, expect, it } from 'vitest';
import { curryWithLazy } from './curry-with-lazy';

type Curried = ((...args: ReadonlyArray<unknown>) => unknown)
  & LazyDefinition<ReadonlyArray<unknown>, never>;

describe('data-first (delegated)', () => {
  it('exact number of arguments', () => {
    expect(purriedFn([13], 37)).toBe('1337');
  });

  it('excess arguments are passed through', () => {
    expect(purriedFn([1], 33, 7)).toBe('1337');
  });
});

describe('data-last (curried)', () => {
  describe('missing a single argument', () => {
    // @ts-expect-error [ts2322] -- `purriedFn` returns `unknown`, like the implementation signature of a utility built on `curryWithLazy`; the tests in this block assert the runtime shape this type describes.
    const curried: Curried = purriedFn(37);

    it('returns a function', () => {
      expect(curried).toBeTypeOf('function');
    });

    it('curried function declares a single parameter', () => {
      expect(curried).toHaveLength(1);
    });

    it('exact number of arguments to curried function', () => {
      expect(curried([13])).toBe('1337');
    });

    it('excess arguments to curried function are ignored', () => {
      expect(curried([1], 3)).toBe('137');
    });

    it('curried function carries the lazy implementation', () => {
      expect(curried.lazy).toBe(lazyImplementation);
    });

    it('curried function carries the arguments for the lazy implementation', () => {
      expect(curried.lazyArgs).toStrictEqual([37]);
    });
  });

  describe('missing more than one argument', () => {
    // @ts-expect-error [ts2322] -- `purriedFn` returns `unknown`, like the implementation signature of a utility built on `curryWithLazy`; the tests in this block assert the runtime shape this type describes.
    const curried: Curried = purriedFn();

    it('returns a function', () => {
      expect(curried).toBeTypeOf('function');
    });

    it('curried function declares a single parameter', () => {
      expect(curried).toHaveLength(1);
    });

    it('exact number of arguments to curried function', () => {
      expect(curried([1337])).toBe('1337<missing>');
    });

    it('excess arguments to curried function are ignored', () => {
      expect(curried([13], 37)).toBe('13<missing>');
    });

    it('curried function carries the lazy implementation', () => {
      expect(curried.lazy).toBe(lazyImplementation);
    });

    it('curried function carries the arguments for the lazy implementation', () => {
      expect(curried.lazyArgs).toStrictEqual([]);
    });
  });
});

function purriedFn(...args: ReadonlyArray<unknown>): unknown {
  return curryWithLazy(concatenateNumberArgs, args, lazyImplementation);
}

function concatenateNumberArgs(
  data: ReadonlyArray<number>,
  other: number | undefined,
): string {
  return `${data.map((x) => x.toString()).join('')}${other?.toString() ?? '<missing>'}${[
    // eslint-disable-next-line prefer-rest-params -- Intentional, we want to bypass the function shape (which is observable at runtime via `Function.length`) to lock in how excess arguments are passed through.
    ...arguments,
  ]
    .slice(2)
    .map((x) => (typeof x === 'number' ? x.toString() : '<NaN>'))
    .join('')}`;
}

function lazyImplementation(): never {
  throw new Error('Intentional! we don\'t run the evaluator in these tests');
}
