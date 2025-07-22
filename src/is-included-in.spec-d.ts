/* eslint-disable sonar/no-all-duplicated-branches */
import { describe, expectTypeOf, it } from 'vitest';
import { isIncludedIn } from './is-included-in';

it('throws on bad value types', () => {
  // @ts-expect-error [ts2322] - strings are not numbers
  isIncludedIn(1, ['yes', 'no']);
});

it('throws on non-overlapping (e.g. typo-proof)', () => {
  const myEnum = 'cat' as 'cat' | 'dog';
  // @ts-expect-error [ts2322] - "doog" is a typo
  isIncludedIn(myEnum, ['doog']);
});

describe('narrowing', () => {
  it('data is single literal, container is pure tuple === NARROWED', () => {
    const data = 1 as const;
    if (isIncludedIn(data, [1] as const)) {
      expectTypeOf(data).toEqualTypeOf<1>();
    } else {
      expectTypeOf(data).toBeNever();
    }
  });

  it('data is literal union, container is pure tuple === NARROWED', () => {
    const data = 1 as 1 | 2 | 3;
    if (isIncludedIn(data, [1] as const)) {
      expectTypeOf(data).toEqualTypeOf<1>();
    } else {
      expectTypeOf(data).toEqualTypeOf<2 | 3>();
    }
  });

  it('data is single literal, container is array === NOT NARROWED', () => {
    const data = 1 as const;
    if (isIncludedIn(data, [1] as Array<1>)) {
      expectTypeOf(data).toEqualTypeOf<1>();
    } else {
      expectTypeOf(data).toEqualTypeOf<1>();
    }
  });

  it('data is literal union, container is array === NOT NARROWED', () => {
    const data = 1 as 1 | 2 | 3;
    if (isIncludedIn(data, [1] as Array<1>)) {
      expectTypeOf(data).toEqualTypeOf<1 | 2 | 3>();
    } else {
      expectTypeOf(data).toEqualTypeOf<1 | 2 | 3>();
    }
  });

  it('data is primitive, container is pure tuple of typeof data === NOT NARROWED', () => {
    const data = 1 as number;
    if (isIncludedIn(data, [1] as [number])) {
      expectTypeOf(data).toEqualTypeOf<number>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number>();
    }
  });

  it('data is primitive, container is array of typeof data === NOT NARROWED', () => {
    const data = 1 as number;
    if (isIncludedIn(data, [1] as Array<number>)) {
      expectTypeOf(data).toEqualTypeOf<number>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number>();
    }
  });

  it('data is primitive, container is pure tuple of literals === NARROWED', () => {
    const data = 1 as number;
    if (isIncludedIn(data, [1] as const)) {
      expectTypeOf(data).toEqualTypeOf<1>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number>();
    }
  });

  it('data is primitive, container is array of literals === NARROWED', () => {
    const data = 1 as number;
    if (isIncludedIn(data, [1] as Array<1>)) {
      expectTypeOf(data).toEqualTypeOf<1>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number>();
    }
  });

  it('data is primitive union, container is pure tuple of literals === NARROWED', () => {
    const data = 1 as number | string;
    if (isIncludedIn(data, [1] as const)) {
      expectTypeOf(data).toEqualTypeOf<1>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    }
  });

  it('data is primitive union, container is pure tuple of primitives === NOT NARROWED', () => {
    const data = 1 as number | string;
    if (isIncludedIn(data, [1] as [number])) {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    }
  });

  it('data is primitive union, container is array of primitives === NOT NARROWED', () => {
    const data = 1 as number | string;
    if (isIncludedIn(data, [1] as Array<number>)) {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    }
  });

  it('pure tuples with literal unions', () => {
    const data = 1 as 1 | 2 | 3;
    if (isIncludedIn(data, [1] as [1 | 2])) {
      expectTypeOf(data).toEqualTypeOf<1 | 2 | 3>();
    } else {
      expectTypeOf(data).toEqualTypeOf<1 | 2 | 3>();
    }
  });
});
