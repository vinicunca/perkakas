import type { ArrayAt } from './array-at';
import type { IterableContainer } from './iterable-container';
import { describe, expectTypeOf, it } from 'vitest';

declare function arrayAt<const T extends IterableContainer, I extends number>(
  data: T,
  index: I,
): ArrayAt<T, I>;

it('primitive index', () => {
  expectTypeOf(arrayAt([1, 2, 3], 0 as number)).toEqualTypeOf<
    1 | 2 | 3 | undefined
  >();
});

it('empty tuple, out of bounds', () => {
  expectTypeOf(arrayAt([], 0)).toEqualTypeOf<undefined>();
});

describe('fixed tuples', () => {
  const DATA = [1, 2, 3, 4, 5] as const;

  it('first', () => {
    expectTypeOf(arrayAt(DATA, 0)).toEqualTypeOf<1>();
  });

  it('middle', () => {
    expectTypeOf(arrayAt(DATA, 2)).toEqualTypeOf<3>();
  });

  it('last', () => {
    expectTypeOf(arrayAt(DATA, 4)).toEqualTypeOf<5>();
  });

  it('far', () => {
    expectTypeOf(arrayAt(DATA, 50)).toEqualTypeOf<undefined>();
  });
});

describe('optional tuples', () => {
  const DATA = [] as [1?, 2?, 3?, 4?, 5?];

  it('first', () => {
    expectTypeOf(arrayAt(DATA, 0)).toEqualTypeOf<1 | undefined>();
  });

  it('middle', () => {
    expectTypeOf(arrayAt(DATA, 2)).toEqualTypeOf<3 | undefined>();
  });

  it('last', () => {
    expectTypeOf(arrayAt(DATA, 4)).toEqualTypeOf<5 | undefined>();
  });

  it('far', () => {
    expectTypeOf(arrayAt(DATA, 50)).toEqualTypeOf<undefined>();
  });
});

describe('mixed tuples', () => {
  const DATA = [1, 2, 3] as [1, 2, 3, 4?, 5?, 6?];

  it('first', () => {
    expectTypeOf(arrayAt(DATA, 0)).toEqualTypeOf<1>();
  });

  it('middle (required)', () => {
    expectTypeOf(arrayAt(DATA, 2)).toEqualTypeOf<3>();
  });

  it('middle (optional)', () => {
    expectTypeOf(arrayAt(DATA, 4)).toEqualTypeOf<5 | undefined>();
  });

  it('last', () => {
    expectTypeOf(arrayAt(DATA, 5)).toEqualTypeOf<6 | undefined>();
  });

  it('far', () => {
    expectTypeOf(arrayAt(DATA, 50)).toEqualTypeOf<undefined>();
  });
});

describe('arrays', () => {
  const DATA = [] as Array<1>;

  it('first', () => {
    expectTypeOf(arrayAt(DATA, 0)).toEqualTypeOf<1 | undefined>();
  });

  it('far', () => {
    expectTypeOf(arrayAt(DATA, 50)).toEqualTypeOf<1 | undefined>();
  });
});

describe('fixed-prefix arrays', () => {
  const DATA = [1, 2, 3] as [1, 2, 3, ...Array<4>];

  it('first', () => {
    expectTypeOf(arrayAt(DATA, 0)).toEqualTypeOf<1>();
  });

  it('middle (required)', () => {
    expectTypeOf(arrayAt(DATA, 2)).toEqualTypeOf<3>();
  });

  it('far', () => {
    expectTypeOf(arrayAt(DATA, 50)).toEqualTypeOf<4 | undefined>();
  });
});

describe('optional-prefix arrays', () => {
  const DATA = [] as [1?, 2?, 3?, ...Array<4>];

  it('first', () => {
    expectTypeOf(arrayAt(DATA, 0)).toEqualTypeOf<1 | undefined>();
  });

  it('middle (required)', () => {
    expectTypeOf(arrayAt(DATA, 2)).toEqualTypeOf<3 | undefined>();
  });

  it('far', () => {
    expectTypeOf(arrayAt(DATA, 50)).toEqualTypeOf<4 | undefined>();
  });
});

describe('mixed-prefix arrays', () => {
  const DATA = [1, 2, 3] as [1, 2, 3, 4?, 5?, 6?, ...Array<7>];

  it('first', () => {
    expectTypeOf(arrayAt(DATA, 0)).toEqualTypeOf<1>();
  });

  it('middle (required)', () => {
    expectTypeOf(arrayAt(DATA, 2)).toEqualTypeOf<3>();
  });

  it('middle (optional)', () => {
    expectTypeOf(arrayAt(DATA, 4)).toEqualTypeOf<5 | undefined>();
  });

  it('far', () => {
    expectTypeOf(arrayAt(DATA, 50)).toEqualTypeOf<7 | undefined>();
  });
});

describe('fixed-suffix arrays', () => {
  const DATA = [2, 3, 4] as [...Array<1>, 2, 3, 4];

  it('first', () => {
    expectTypeOf(arrayAt(DATA, 0)).toEqualTypeOf<1 | 2>();
  });

  it('middle', () => {
    expectTypeOf(arrayAt(DATA, 2)).toEqualTypeOf<1 | 2 | 3 | 4>();
  });

  it('far', () => {
    expectTypeOf(arrayAt(DATA, 50)).toEqualTypeOf<1 | 2 | 3 | 4 | undefined>();
  });
});

describe('fixed-elements arrays', () => {
  const DATA = [1, 2, 3, 5, 6, 7] as [1, 2, 3, ...Array<4>, 5, 6, 7];

  it('first', () => {
    expectTypeOf(arrayAt(DATA, 0)).toEqualTypeOf<1>();
  });

  it('middle (prefix)', () => {
    expectTypeOf(arrayAt(DATA, 2)).toEqualTypeOf<3>();
  });

  it('middle (suffix)', () => {
    expectTypeOf(arrayAt(DATA, 4)).toEqualTypeOf<4 | 5 | 6>();
  });

  it('far', () => {
    expectTypeOf(arrayAt(DATA, 50)).toEqualTypeOf<4 | 5 | 6 | 7 | undefined>();
  });
});

describe('unions', () => {
  it('union of indices, fixed tuples', () => {
    expectTypeOf(arrayAt([1, 2, 3], 0 as 0 | 1)).toEqualTypeOf<1 | 2>();
  });

  it('union of indices, arrays', () => {
    expectTypeOf(arrayAt([] as Array<1>, 0 as 0 | 1)).toEqualTypeOf<1 | undefined>();
  });

  it('union of indices, fixed-elements array', () => {
    expectTypeOf(
      arrayAt([1, 2, 3, 5, 6, 7] as [1, 2, 3, ...Array<4>, 5, 6, 7], 1 as 1 | 4),
    ).toEqualTypeOf<2 | 4 | 5 | 6>();
  });

  it('union of fixed tuples', () => {
    expectTypeOf(arrayAt([1, 2, 3] as [1, 2, 3] | [4, 5, 6], 0)).toEqualTypeOf<
      1 | 4
    >();
  });

  it('union of member types', () => {
    expectTypeOf(
      arrayAt([1, 3, 5] as [1 | 2, 3 | 4, 5 | 6, ...Array<'cat' | 'dog'>], 1),
    ).toEqualTypeOf<3 | 4>();
    expectTypeOf(
      arrayAt([1, 3, 5] as [1 | 2, 3 | 4, 5 | 6, ...Array<'cat' | 'dog'>], 50),
    ).toEqualTypeOf<'cat' | 'dog' | undefined>();
  });
});
