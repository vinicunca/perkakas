import { only } from './only';
import { pipe } from './pipe';

describe('runtime', () => {
  describe('dataFirst', () => {
    it('empty array', () => {
      expect(only([])).toBeUndefined();
    });

    it('length 1 array', () => {
      expect(only([1])).toEqual(1);
    });

    it('length 2 array', () => {
      expect(only([1, 2])).toBeUndefined();
    });
  });

  describe('data last', () => {
    it('empty array', () => {
      expect(pipe([], only())).toBeUndefined();
    });

    it('length 1 array', () => {
      expect(pipe([1], only())).toEqual(1);
    });

    it('length 2 array', () => {
      expect(pipe([1, 2], only())).toBeUndefined();
    });
  });

  it('simple tuple', () => {
    expect(only([1, 'a'])).toBeUndefined();
  });

  it('tuple with last', () => {
    expect(only(['a', 1])).toBeUndefined();
  });

  it('tuple with two last', () => {
    expect(only(['a', 1, 2])).toBeUndefined();
  });

  it('tuple with first and last', () => {
    expect(only([1, 'a', 2])).toBeUndefined();
  });
});

describe('typing', () => {
  it('simple array', () => {
    const result = only([] as Array<number>);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it('simple non-empty array', () => {
    const result = only([1] as [number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it('simple tuple', () => {
    const result = only([1, 'a'] as [number, string]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  it('array with more than one item', () => {
    const result = only([1, 2] as [number, number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  it('trivial empty array', () => {
    const result = only([] as []);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  it('array with last', () => {
    const result = only([1] as [...Array<number>, number]);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it('tuple with last', () => {
    const result = only(['a', 1] as [...Array<string>, number]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });

  it('tuple with two last', () => {
    const result = only(['a', 1, 2] as [...Array<string>, number, number]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  it('tuple with first and last', () => {
    const result = only([1, 'a', 2] as [number, ...Array<string>, number]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  it('tuple with optional and array', () => {
    const result = only(['a', 1] as [string?, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });

  it('tuple with all optional', () => {
    const result = only(['a', 1] as [string?, number?]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });

  it('simple readonly array', () => {
    const result = only([] as ReadonlyArray<number>);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it('simple non-empty readonly array', () => {
    const result = only([1] as readonly [number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it('simple readonly tuple', () => {
    const result = only([1, 'a'] as readonly [number, string]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  it('readonly array with more than one item', () => {
    const result = only([1, 2] as readonly [number, number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  it('readonly trivial empty array', () => {
    const result = only([] as const);
    expectTypeOf(result).toEqualTypeOf(undefined);
  });

  it('readonly array with last', () => {
    const result = only([1] as readonly [...Array<number>, number]);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it('readonly tuple with last', () => {
    const result = only(['a', 1] as readonly [...Array<string>, number]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });

  it('readonly tuple with optional and array', () => {
    const result = only(['a', 1] as readonly [string?, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });

  it('readonly tuple with all optional', () => {
    const result = only(['a', 1] as readonly [string?, number?]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });
});
