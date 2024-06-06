import { concat } from './concat';
import { pick } from './pick';
import { pipe } from './pipe';

describe('runtime', () => {
  it('dataFirst', () => {
    const result = pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']);
    expect(result).toStrictEqual({ a: 1, d: 4 });
  });

  it('support inherited properties', () => {
    class BaseClass {
      testProp(): string {
        return 'abc';
      }
    }
    class TestClass extends BaseClass {}
    const testClass = new TestClass();
    expectTypeOf(pick(testClass, ['testProp'])).toEqualTypeOf<{
      testProp: () => string;
    }>();
  });

  it('dataLast', () => {
    const result = pipe({ a: 1, b: 2, c: 3, d: 4 }, pick(['a', 'd']));
    expect(result).toEqual({ a: 1, d: 4 });
  });

  it('read only', () => {
    concat([1, 2], [3, 4] as const);
    // or similar:
    // const props: ReadonlyArray<string> = ["prop1", "prop2"];
    // const getProps = <T extends string>(props: readonly T[]) => props;
    const someObject = { prop1: 'a', prop2: 2, a: 'b' };
    const props = ['prop1', 'prop2'] as const;
    pick(someObject, props); // TS2345 compilation error
  });

  it('it can pick symbol keys', () => {
    const mySymbol = Symbol('mySymbol');
    expect(pick({ [mySymbol]: 3, a: 4 }, [mySymbol])).toStrictEqual({
      [mySymbol]: 3,
    });
  });
});

describe('typing', () => {
  describe('data first', () => {
    it('non existing prop', () => {
      // @ts-expect-error [ts2322] -- should not allow non existing props
      pick({ a: 1, b: 2, c: 3, d: 4 }, ['not', 'in']);
    });

    it('complex type', () => {
      const obj = { a: 1 } as { a: number } | { a?: number; b: string };
      const result = pick(obj, ['a']);
      expectTypeOf(result).toEqualTypeOf<
        Pick<{ a: number } | { a?: number; b: string }, 'a'>
      >();
    });
  });

  describe('data last', () => {
    it('non existing prop', () => {
      pipe(
        { a: 1, b: 2, c: 3, d: 4 },
        // @ts-expect-error [ts2345] -- should not allow non existing props
        pick(['not', 'in']),
      );
    });

    it('complex type', () => {
      const obj = { a: 1 } as { a: number } | { a?: number; b: string };
      const result = pipe(obj, pick(['a']));
      expectTypeOf(result).toEqualTypeOf<
        Pick<{ a: number } | { a?: number; b: string }, 'a'>
      >();
    });
  });

  it('multiple keys', () => {
    interface Data {
      aProp: string; bProp: string;
    }

    const obj: Data = {
      aProp: 'p1',

      bProp: 'p2',
    };

    const result = pipe(obj, pick(['aProp', 'bProp']));

    expectTypeOf(result).toEqualTypeOf<Pick<Data, 'aProp' | 'bProp'>>();
  });
});
