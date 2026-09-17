import { describe, expectTypeOf, it, test } from 'vitest';
import { add } from './add';
import { constant } from './constant';
import { identity } from './identity';
import { map } from './map';
import { pipe } from './pipe';
import { sortBy } from './sort-by';

test('number array', () => {
  const result = map([1, 2, 3] as Array<number>, add(1));

  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

test('readonly number array', () => {
  const result = map([1, 2, 3] as ReadonlyArray<number>, add(1));

  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

test('number 3-tuple', () => {
  const result = map([1, 2, 3] as [number, number, number], add(1));

  expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
});

test('readonly number 3-tuple', () => {
  const result = map([1, 2, 3] as readonly [number, number, number], add(1));

  expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
});

test('named number 3-tuple', () => {
  const result = map(
    [1, 2, 3] as [item1: number, item2: number, item3: number],
    add(1),
  );

  // There's no way to test this, but notice that the names are copied to the
  // output here...
  expectTypeOf(result).toEqualTypeOf<
    [item1: number, item2: number, item3: number]
  >();
});

test('mixed type tuple', () => {
  expectTypeOf(
    map([1, '2', true] as [number, string, boolean], constant(1)),
  ).toEqualTypeOf<[1, 1, 1]>();
});

test('readonly mixed type tuple', () => {
  expectTypeOf(
    map([1, '2', true] as readonly [number, string, boolean], constant(1)),
  ).toEqualTypeOf<[1, 1, 1]>();
});

test('nonempty (tail) number array', () => {
  const result = map([1, 2, 3] as [number, ...Array<number>], add(1));

  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
});

test('nonempty (tail) readonly number array', () => {
  const result = map([1, 2, 3] as readonly [number, ...Array<number>], add(1));

  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
});

test('nonempty (head) number array', () => {
  const result = map([1, 2, 3] as [...Array<number>, number], add(1));

  expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
});

test('nonempty readonly (head) number array', () => {
  const result = map([1, 2, 3] as readonly [...Array<number>, number], add(1));

  expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
});

test('empty tuple', () => {
  expectTypeOf(map([], add(1))).toEqualTypeOf<[]>();
});

test('all-optional tuple', () => {
  expectTypeOf(map([] as [a?: number, b?: number], identity())).toEqualTypeOf<
    [a?: number, b?: number]
  >();
});

describe('indexed', () => {
  it('number array', () => {
    const result = map([1, 2, 3] as Array<number>, (x, index) => x + index);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('readonly number array', () => {
    const result = map([1, 2, 3] as ReadonlyArray<number>, (x, index) => x + index);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('number 3-tuple', () => {
    const result = map(
      [1, 2, 3] as [number, number, number],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it('readonly number 3-tuple', () => {
    const result = map(
      [1, 2, 3] as readonly [number, number, number],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it('named number 3-tuple', () => {
    const result = map(
      [1, 2, 3] as [item1: number, item2: number, item3: number],
      (x, index) => x + index,
    );

    // There's no way to test this, but notice that the names are copied to the
    // output here...
    expectTypeOf(result).toEqualTypeOf<
      [item1: number, item2: number, item3: number]
    >();
  });

  it('mixed type tuple', () => {
    const result = map(
      [1, '2', true] as [number, string, boolean],
      (_, index) => index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it('readonly mixed type tuple', () => {
    const result = map(
      [1, '2', true] as readonly [number, string, boolean],
      (_, index) => index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it('nonempty (tail) number array', () => {
    const result = map(
      [1, 2, 3] as [number, ...Array<number>],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it('nonempty (tail) readonly number array', () => {
    const result = map(
      [1, 2, 3] as readonly [number, ...Array<number>],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it('nonempty (head) number array', () => {
    const result = map(
      [1, 2, 3] as [...Array<number>, number],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });

  it('nonempty readonly (head) number array', () => {
    const result = map(
      [1, 2, 3] as readonly [...Array<number>, number],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });
});

describe('limited type inference through `NoInfer` (#1364)', () => {
  it('data-first returns a plain array', () => {
    expectTypeOf(map([] as NoInfer<Array<number>>, identity())).toEqualTypeOf<
      Array<number>
    >();
  });

  it('works with readonly arrays', () => {
    expectTypeOf(
      map([] as NoInfer<ReadonlyArray<number>>, identity()),
    ).toEqualTypeOf<Array<number>>();
  });

  it('result flows into a downstream IterableContainer constraint', () => {
    const mapped = map([] as NoInfer<Array<number>>, identity());

    expectTypeOf(sortBy(mapped, identity())).toEqualTypeOf<Array<number>>();
  });

  it('data-last in a pipe flows into sortBy', () => {
    expectTypeOf(
      pipe([] as NoInfer<Array<number>>, map(identity()), sortBy(identity())),
    ).toEqualTypeOf<Array<number>>();
  });
});

describe('callback data param', () => {
  it('complete in data-first', () => {
    map([1, 2, 3] as const, (_value, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();

      return 0;
    });
  });

  it('lazily reconstructed in data-last', () => {
    pipe(
      [1, 2, 3] as const,
      map((_value, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

        return 0;
      }),
    );
  });
});
