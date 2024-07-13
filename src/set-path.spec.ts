import { pipe } from './pipe';
import { setPath } from './set-path';
import { stringToPath } from './string-to-path';

// eslint-disable-next-line ts/consistent-type-definitions
type TestType = {
  a: {
    b: { c: number; d?: number };
    e: Array<{ f: { g: number } }>;
    z?: number | undefined;
  };
  x?: number;
  y?: number;
};

const TEST_OBJECT: TestType = {
  a: { b: { c: 1 }, e: [{ f: { g: 1 } }, { f: { g: 1 } }] },
  y: 10,
};

describe('data first', () => {
  it('should set a deeply nested value', () => {
    expect(setPath(TEST_OBJECT, ['a', 'b', 'c'], 2)).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, b: { c: 2 } },
    });
  });

  it('should work nested arrays', () => {
    expect(setPath(TEST_OBJECT, ['a', 'e', 1, 'f', 'g'], 2)).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, e: [{ f: { g: 1 } }, { f: { g: 2 } }] },
    });
  });

  it('should work with undefined / optional types', () => {
    expect(setPath(TEST_OBJECT, ['a', 'z'], undefined)).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, z: undefined },
    });
  });

  it('should support partial paths', () => {
    expect(setPath(TEST_OBJECT, ['a', 'b'], { c: 2 })).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, b: { c: 2 } },
    });
  });

  it('should combo well with stringToPath', () => {
    expect(setPath(TEST_OBJECT, stringToPath('a.b.c'), 2)).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, b: { c: 2 } },
    });
  });
});

describe('data last', () => {
  it('should set a deeply nested value', () => {
    expect(pipe(TEST_OBJECT, setPath(['a', 'b', 'c'], 2))).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, b: { c: 2 } },
    });
  });

  it('should work nested arrays', () => {
    expect(
      pipe(TEST_OBJECT, setPath(['a', 'e', 1, 'f', 'g'], 2)),
    ).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, e: [{ f: { g: 1 } }, { f: { g: 2 } }] },
    });
  });

  it('should work with undefined / optional types', () => {
    expect(pipe(TEST_OBJECT, setPath(['a', 'z'], undefined))).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, z: undefined },
    });
  });

  it('should support partial paths', () => {
    expect(pipe(TEST_OBJECT, setPath(['a', 'b'], { c: 2 }))).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, b: { c: 2 } },
    });
  });
});
