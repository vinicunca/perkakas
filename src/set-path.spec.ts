import { describe, expect, it } from 'vitest';

import { pipe } from './pipe';
import { setPath } from './set-path';
import { stringToPath } from './string-to-path';

interface SampleType {
  a: {
    b: {
      c: number;
      d?: number;
    };
    e: Array<{ f: { g: number } }>;
    z?: number | undefined;
  };
  x?: number;
  y?: number;
}

const obj: SampleType = {
  a: {
    b: {
      c: 1,
    },
    e: [{ f: { g: 1 } }, { f: { g: 1 } }],
  },
  y: 10,
};

describe('data first', () => {
  it('should set a deeply nested value', () => {
    expect<SampleType>(setPath(obj, ['a', 'b', 'c'], 2)).toEqual({
      ...obj,
      a: {
        ...obj.a,
        b: {
          c: 2,
        },
      },
    });
  });

  it('should work nested arrays', () => {
    expect<SampleType>(setPath(obj, ['a', 'e', 1, 'f', 'g'], 2)).toEqual({
      ...obj,
      a: {
        ...obj.a,
        e: [{ f: { g: 1 } }, { f: { g: 2 } }],
      },
    });
  });

  it('should correctly type value argument', () => {
    expect<SampleType>(
      // @ts-expect-error - this path should yield a type of number
      setPath(obj, ['a', 'e', 1, 'f', 'g'], 'hello'),
    ).toEqual({
      ...obj,
      a: {
        ...obj.a,
        e: [{ f: { g: 1 } }, { f: { g: 'hello' } }],
      },
    });
  });

  it('should correctly type path argument', () => {
    // @ts-expect-error - 'hello' isn't a valid path
    expect<SampleType>(setPath(obj, ['a', 'hello'], 'hello')).toEqual({
      ...obj,
      a: {
        ...obj.a,
        hello: 'hello',
      },
    });
  });

  it('should work with undefined / optional types', () => {
    expect<SampleType>(setPath(obj, ['a', 'z'], undefined)).toEqual({
      ...obj,
      a: {
        ...obj.a,
        z: undefined,
      },
    });
  });

  it('should support partial paths', () => {
    expect<SampleType>(setPath(obj, ['a', 'b'], { c: 2 })).toEqual({
      ...obj,
      a: {
        ...obj.a,
        b: { c: 2 },
      },
    });
  });

  it('should correctly type partial paths', () => {
    // @ts-expect-error - this path should yield a type of { c: number }
    expect<SampleType>(setPath(obj, ['a', 'b'], 123)).toEqual({
      ...obj,
      a: {
        ...obj.a,
        b: 123,
      },
    });
  });

  it('should combo well with stringToPath', () => {
    expect<SampleType>(setPath(obj, stringToPath('a.b.c'), 2)).toEqual({
      ...obj,
      a: {
        ...obj.a,
        b: {
          c: 2,
        },
      },
    });
  });
});

describe('data last', () => {
  it('should set a deeply nested value', () => {
    expect<SampleType>(pipe(obj, setPath(['a', 'b', 'c'], 2))).toEqual({
      ...obj,
      a: {
        ...obj.a,
        b: {
          c: 2,
        },
      },
    });
  });

  it('should work nested arrays', () => {
    expect<SampleType>(pipe(obj, setPath(['a', 'e', 1, 'f', 'g'], 2))).toEqual({
      ...obj,
      a: {
        ...obj.a,
        e: [{ f: { g: 1 } }, { f: { g: 2 } }],
      },
    });
  });

  it('should correctly type value argument', () => {
    expect<SampleType>(
      pipe(
        obj,
        // @ts-expect-error - this path should yield a type of number
        setPath(['a', 'e', 1, 'f', 'g'], 'hello'),
      ),
    ).toEqual({
      ...obj,
      a: {
        ...obj.a,
        e: [{ f: { g: 1 } }, { f: { g: 'hello' } }],
      },
    });
  });

  it('should correctly type path argument', () => {
    // @ts-expect-error - 'hello' isn't a valid path
    expect<SampleType>(pipe(obj, setPath(['a', 'hello'], 'hello'))).toEqual({
      ...obj,
      a: {
        ...obj.a,
        hello: 'hello',
      },
    });
  });

  it('should work with undefined / optional types', () => {
    const t = setPath(['a', 'z'], undefined);
    expect<SampleType>(pipe(obj, t)).toEqual({
      ...obj,
      a: {
        ...obj.a,
        z: undefined,
      },
    });
  });

  it('should support partial paths', () => {
    expect<SampleType>(pipe(obj, setPath(['a', 'b'], { c: 2 }))).toEqual({
      ...obj,
      a: {
        ...obj.a,
        b: { c: 2 },
      },
    });
  });

  it('should correctly type partial paths', () => {
    // @ts-expect-error - this path should yield a type of { c: number }
    expect<SampleType>(pipe(obj, setPath(['a', 'b'], 123))).toEqual({
      ...obj,
      a: {
        ...obj.a,
        b: 123,
      },
    });
  });
});
