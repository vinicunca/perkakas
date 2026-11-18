import { curry } from './curry';
import { describe, expect, it } from 'vitest';

// A regular arrow function would only return these keys when inspected via
// `Reflect.ownKeys`. Any other key on the function means it was augmented after
// creation.
const ARROW_FUNCTION_OWN_PROPS = ['length', 'name'];

type RestArgsFunction = (...args: ReadonlyArray<unknown>) => unknown;

describe('data-first (delegated)', () => {
  it('exact number of arguments', () => {
    expect(purriedFn(13, 37)).toBe('1337');
  });

  it('excess arguments are passed through', () => {
    expect(purriedFn(1, 33, 7)).toBe('1337');
  });

  it('as a callback, the extra arguments run it data-first', () => {
    expect([13, 37].map(purriedFn)).toStrictEqual(['130<NaN>', '371<NaN>']);
  });

  it('a defaulted parameter isn\'t counted, so omitting it runs data-first', () => {
    expect(curry(addWithDefault, [1])).toBe(2);
  });
});

describe('data-last (curried)', () => {
  describe('missing a single argument', () => {
    // @ts-expect-error [ts2322] -- `purriedFn` returns `unknown`, like the implementation signature of a utility built on `curry`; the tests in this block assert the runtime shape this type describes.
    const curried: RestArgsFunction = purriedFn(37);

    it('returns a function', () => {
      expect(curried).toBeTypeOf('function');
    });

    it('curried function declares a single parameter', () => {
      expect(curried).toHaveLength(1);
    });

    it('exact number of arguments to curried function', () => {
      expect(curried(13)).toBe('1337');
    });

    it('excess arguments to curried function are ignored', () => {
      expect(curried(1, 3)).toBe('137');
    });

    it('curried function carries no metadata', () => {
      expect(Reflect.ownKeys(curried)).toStrictEqual(ARROW_FUNCTION_OWN_PROPS);
    });
  });

  describe('missing more than one argument', () => {
    // @ts-expect-error [ts2322] -- `purriedFn` returns `unknown`, like the implementation signature of a utility built on `curry`; the tests in this block assert the runtime shape this type describes.
    const curried: RestArgsFunction = purriedFn();

    it('returns a function', () => {
      expect(curried).toBeTypeOf('function');
    });

    it('curried function declares a single parameter', () => {
      expect(curried).toHaveLength(1);
    });

    it('exact number of arguments to curried function', () => {
      expect(curried(1337)).toBe('1337');
    });

    it('excess arguments to curried function are ignored', () => {
      expect(curried(13, 37)).toBe('13');
    });

    it('curried function carries no metadata', () => {
      expect(Reflect.ownKeys(curried)).toStrictEqual(ARROW_FUNCTION_OWN_PROPS);
    });
  });

  it('passes every argument when there are several', () => {
    const curried = curry(concatenateThreeNumbers, [3, 7]);

    expect(curried).toBeTypeOf('function');
    expect(typeof curried === 'function' && curried(1)).toBe('137');
  });
});

function purriedFn(...args: ReadonlyArray<unknown>): unknown {
  return curry(concatenateNumberArgs, args);
}

function addWithDefault(augend: number, addend = 1): number {
  return augend + addend;
}

const concatenateThreeNumbers = (
  data: number,
  first: number,
  second: number,
): string => [data, first, second].join('');

function concatenateNumberArgs(_a: number, _b: number): string {
  // eslint-disable-next-line prefer-rest-params -- Intentional, we want to bypass the function shape (which is observable at runtime via `Function.length`) to lock in how excess arguments are passed through.
  return [...arguments]
    .map((x) => (typeof x === 'number'
      ? x.toString()
      : '<NaN>'))
    .join('');
}
