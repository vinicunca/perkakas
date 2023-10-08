import { describe, expect, expectTypeOf, it } from 'vitest';
import { pipe } from '../function';
import { concat } from '../array';
import { pick } from './pick';

describe('data first', () => {
  it('it should pick props', () => {
    const result = pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']);
    expect(result).toStrictEqual({ a: 1, d: 4 });
  });
  it('allow undefined or null', () => {
    expect(pick(undefined as any, ['foo'])).toEqual({});
    expect(pick(null as any, ['foo'])).toEqual({});
  });
  it('support inherited properties', () => {
    class BaseClass {
      testProp() {
        return 'abc';
      }
    }
    class TestClass extends BaseClass {}
    const testClass = new TestClass();
    expect(pick(testClass, ['testProp'])).toEqual({
      testProp: expect.any(Function),
    });
  });
});

describe('data last', () => {
  it('it should pick props', () => {
    const result = pipe({ a: 1, b: 2, c: 3, d: 4 }, pick(['a', 'd']));
    expect(result).toEqual({ a: 1, d: 4 });
  });
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

it('type for curried form', () => {
  const pickFoo = pick(['foo']);

  expectTypeOf(true as any as ReturnType<typeof pickFoo>).toEqualTypeOf<
  Record<'foo', any>
  >();

  const result = pickFoo({ foo: 1, bar: 'potato' });

  expectTypeOf(result).toEqualTypeOf<{ foo: number }>();
});