import { pipe } from './pipe';
import { setPath } from './set-path';
import { stringToPath } from './string-to-path';

interface TestType {
  a: {
    b: { c: number; d?: number };
    e: Array<{ f: { g: number } }>;
    z?: number | undefined;
  };
  x?: number;
  y?: number;
}

const TEST_OBJECT: TestType = {
  a: { b: { c: 1 }, e: [{ f: { g: 1 } }, { f: { g: 1 } }] },
  y: 10,
};

describe('runtime', () => {
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
});

describe('typing', () => {
  describe('data first', () => {
    it('should correctly type value argument', () => {
      // @ts-expect-error [ts2345] - this path should yield a type of number
      setPath(TEST_OBJECT, ['a', 'e', 1, 'f', 'g'], 'hello');

      // Like this:
      setPath(TEST_OBJECT, ['a', 'e', 1, 'f', 'g'], 123);
    });

    it('should correctly type path argument', () => {
      // @ts-expect-error [ts2322] - 'hello' isn't a valid path
      setPath(TEST_OBJECT, ['a', 'hello'], 'hello');

      // Like this:
      setPath(TEST_OBJECT, ['a', 'z'], 123);
    });

    it('should correctly type partial paths', () => {
      // @ts-expect-error [ts2345] - this path should yield a type of { c: number }
      setPath(TEST_OBJECT, ['a', 'b'] as const, 123);

      // Like this:
      setPath(TEST_OBJECT, ['a', 'b'] as const, { c: 123 });
    });
  });

  describe('data last', () => {
    it('should correctly type value argument', () => {
      // @ts-expect-error [ts2345] - this path should yield a type of number
      pipe(TEST_OBJECT, setPath(['a', 'e', 1, 'f', 'g'], 'hello'));

      // Like this:
      pipe(TEST_OBJECT, setPath(['a', 'e', 1, 'f', 'g'], 123));
    });

    it('should correctly type path argument', () => {
      // @ts-expect-error - 'hello' isn't a valid path
      pipe(TEST_OBJECT, setPath(['a', 'hello'], 'hello'));

      // Like this:
      pipe(TEST_OBJECT, setPath(['a', 'z'], 123));
    });

    it('should correctly type partial paths', () => {
      // @ts-expect-error - this path should yield a type of { c: number }
      pipe(TEST_OBJECT, setPath(['a', 'b'] as const, 123));

      // Like this:
      pipe(TEST_OBJECT, setPath(['a', 'b'] as const, { c: 123 }));
    });
  });
});
