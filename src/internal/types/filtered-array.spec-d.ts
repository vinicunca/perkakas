import type { FilteredArray } from './filtered-array';
import type { IterableContainer } from './iterable-container';
import { describe, expectTypeOf, it } from 'vitest';

declare function filteredArray<T extends IterableContainer, C>(
  data: T,
  condition: C,
): FilteredArray<T, C>;

it('empty array', () => {
  expectTypeOf(filteredArray([], '' as string)).toEqualTypeOf<[]>();
});

it('empty readonly array', () => {
  expectTypeOf(filteredArray([] as const, '' as string)).toEqualTypeOf<[]>();
});

describe('condition is a primitive', () => {
  it('primitive array', () => {
    expectTypeOf(
      filteredArray([] as Array<string>, '' as string),
    ).toEqualTypeOf<Array<string>>();
  });

  it('primitive readonly array', () => {
    expectTypeOf(
      filteredArray([] as ReadonlyArray<string>, '' as string),
    ).toEqualTypeOf<Array<string>>();
  });

  it('union of primitives array', () => {
    expectTypeOf(
      filteredArray([] as Array<string | number | boolean>, '' as string),
    ).toEqualTypeOf<Array<string>>();
  });

  it('union of primitives readonly array', () => {
    expectTypeOf(
      filteredArray(
        [] as ReadonlyArray<string | number | boolean>,
        '' as string,
      ),
    ).toEqualTypeOf<Array<string>>();
  });

  it('array of literals', () => {
    expectTypeOf(
      filteredArray([] as Array<'hello'>, '' as string),
    ).toEqualTypeOf<Array<'hello'>>();
  });

  it('readonly array of literals', () => {
    expectTypeOf(
      filteredArray([] as ReadonlyArray<'hello'>, '' as string),
    ).toEqualTypeOf<Array<'hello'>>();
  });

  it('array with a union of literals', () => {
    expectTypeOf(
      filteredArray([] as Array<'hello' | 3 | true>, '' as string),
    ).toEqualTypeOf<Array<'hello'>>();
  });

  it('readonly array with a union of literals', () => {
    expectTypeOf(
      filteredArray([] as ReadonlyArray<'hello' | 3 | true>, '' as string),
    ).toEqualTypeOf<Array<'hello'>>();
  });

  it('tuple of primitives', () => {
    expectTypeOf(
      filteredArray(
        [1, 'hello', true] as [number, string, boolean],
        '' as string,
      ),
    ).toEqualTypeOf<[string]>();
  });

  it('readonly tuple of primitives', () => {
    expectTypeOf(
      filteredArray(
        [1, 'hello', true] as readonly [number, string, boolean],
        '' as string,
      ),
    ).toEqualTypeOf<[string]>();
  });

  it('tuple of literals', () => {
    expectTypeOf(
      filteredArray([1, 'hello', true] as [1, 'hello', true], '' as string),
    ).toEqualTypeOf<['hello']>();
  });

  it('readonly tuple of literals', () => {
    expectTypeOf(
      filteredArray([1, 'hello', true] as const, '' as string),
    ).toEqualTypeOf<['hello']>();
  });

  it('complex tuple of primitives, filtered on the prefix', () => {
    expectTypeOf(
      filteredArray(
        ['hello', 3] as [string, ...Array<boolean>, number],
        '' as string,
      ),
    ).toEqualTypeOf<[string]>();
  });

  it('complex tuple of primitives, filtered on the rest', () => {
    expectTypeOf(
      filteredArray(
        [true, 3] as [boolean, ...Array<string>, number],
        '' as string,
      ),
    ).toEqualTypeOf<Array<string>>();
  });

  it('complex tuple of primitives, filtered on the suffix', () => {
    expectTypeOf(
      filteredArray(
        [true, 'hello'] as [boolean, ...Array<number>, string],
        '' as string,
      ),
    ).toEqualTypeOf<[string]>();
  });

  it('tuple with unions of literals', () => {
    expectTypeOf(
      filteredArray(
        ['hello', 'foo'] as ['hello' | 'world', 'foo' | 'bar'],
        '' as string,
      ),
    ).toEqualTypeOf<
      ['hello', 'foo'] | ['world', 'foo'] | ['hello', 'bar'] | ['world', 'bar']
    >();
  });

  it('complex tuple with union of literals', () => {
    expectTypeOf(
      filteredArray(
        ['prefix', 'suffix'] as [
          'prefix' | 123,
          ...Array<'rest' | true>,
          'suffix' | Date,
        ],
        '' as string,
      ),
    ).toEqualTypeOf<
      | Array<'rest'>
      | [...Array<'rest'>, 'suffix']
      | ['prefix', ...Array<'rest'>]
      | ['prefix', ...Array<'rest'>, 'suffix']
    >();
  });

  it('disjoint types', () => {
    expectTypeOf(
      filteredArray([] as Array<number>, '' as string),
    ).toEqualTypeOf<[]>();
  });
});

describe('condition is a literal', () => {
  it('array with matching literal', () => {
    expectTypeOf(
      filteredArray([] as Array<string>, 'hello' as const),
    ).toEqualTypeOf<Array<'hello'>>();
  });

  it('array with literal union including the condition', () => {
    expectTypeOf(
      filteredArray([] as Array<'hello' | 'world'>, 'hello' as const),
    ).toEqualTypeOf<Array<'hello'>>();
  });

  it('array with no matching literals', () => {
    expectTypeOf(
      filteredArray([] as Array<'world' | 'goodbye'>, 'hello' as const),
    ).toEqualTypeOf<[]>();
  });

  it('tuple with primitive types', () => {
    expectTypeOf(
      filteredArray(
        ['hello', 1, 'world'] as [string, number, string],
        'hello' as const,
      ),
    ).toEqualTypeOf<[] | ['hello'] | ['hello', 'hello']>();
  });

  it('tuple with matching and non-matching literals', () => {
    expectTypeOf(
      filteredArray(
        ['hello', 'world', 'hello'] as ['hello', 'world', 'hello'],
        'hello' as const,
      ),
    ).toEqualTypeOf<['hello', 'hello']>();
  });

  it('readonly tuple with matching literal', () => {
    expectTypeOf(
      filteredArray(['hello', 'world', 'hello'] as const, 'hello' as const),
    ).toEqualTypeOf<['hello', 'hello']>();
  });

  it('complex tuple with matching literal in rest position', () => {
    expectTypeOf(
      filteredArray(
        ['start', 'hello', 'hello', 'end'] as [
          'start',
          ...Array<'hello' | 'world'>,
          'end',
        ],
        'hello' as const,
      ),
    ).toEqualTypeOf<Array<'hello'>>();
  });
});

describe('condition is a simple object', () => {
  it('array of matching objects', () => {
    expectTypeOf(
      filteredArray([] as Array<{ a: string }>, { a: '' } as { a: string }),
    ).toEqualTypeOf<Array<{ a: string }>>();
  });

  it('array of objects with matching and additional properties', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: string; b: number }>,
        { a: '' } as { a: string },
      ),
    ).toEqualTypeOf<Array<{ a: string; b: number }>>();
  });

  it('array with mixed types including matching objects', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: string } | string | number>,
        { a: '' } as { a: string },
      ),
    ).toEqualTypeOf<Array<{ a: string }>>();
  });

  it('tuple with mixed types including matching objects', () => {
    expectTypeOf(
      filteredArray(
        [''] as [{ a: string } | string | number],
        { a: '' } as { a: string },
      ),
    ).toEqualTypeOf<[] | [{ a: string }]>();
  });

  it('array with no matching objects', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ b: string } | string>,
        { a: '' } as { a: string },
      ),
    ).toEqualTypeOf<[]>();
  });

  it('tuple with matching and non-matching objects', () => {
    expectTypeOf(
      filteredArray(
        [
          { a: 'value' },
          { a: 'hello' },
          { b: 42 },
          { a: 'hello', c: true },
        ] as [
          { a: string },
          { a: 'hello' },
          { b: number },
          { a: string; c: boolean },
        ],
        { a: '' } as { a: string },
      ),
    ).toEqualTypeOf<
      [{ a: string }, { a: 'hello' }, { a: string; c: boolean }]
    >();
  });
});

describe('condition is a complex object', () => {
  it('array of exactly matching objects', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: 'hello'; b?: number }>,
        { a: 'hello' } as { a: 'hello'; b?: number },
      ),
    ).toEqualTypeOf<Array<{ a: 'hello'; b?: number }>>();
  });

  it('array of objects with compatible literal property', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: 'hello' | 'world'; b?: number }>,
        { a: 'hello' } as { a: 'hello'; b?: number },
      ),
    ).toEqualTypeOf<Array<{ a: 'hello'; b?: number }>>();
  });

  it('array of objects with incompatible literal property', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: 'world'; b?: number }>,
        { a: 'hello' } as { a: 'hello'; b?: number },
      ),
    ).toEqualTypeOf<[]>();
  });

  it('array of objects missing optional property', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: 'hello' }>,
        { a: 'hello' } as { a: 'hello'; b?: number },
      ),
    ).toEqualTypeOf<Array<{ a: 'hello' }>>();
  });

  it('array with mixed types including matching objects', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: 'hello'; b: number } | { a: 'world' } | string>,
        { a: 'hello' } as { a: 'hello'; b?: number },
      ),
    ).toEqualTypeOf<Array<{ a: 'hello'; b: number }>>();
  });

  it('tuple with mixed complex objects', () => {
    expectTypeOf(
      filteredArray(
        [{ a: 'hello' }, { a: 'world' }, { a: 'hello', b: 42 }] as [
          { a: 'hello' },
          { a: 'world' },
          { a: 'hello'; b: number },
        ],
        { a: 'hello' } as { a: 'hello'; b?: number },
      ),
    ).toEqualTypeOf<[{ a: 'hello' }, { a: 'hello'; b: number }]>();
  });

  it('partial matches', () => {
    expectTypeOf(
      filteredArray(
        [
          { a: 'hello' },
          { a: 'world' },
          { b: 'hello' },
          { b: 'world' },
          { a: 'hello', b: 'world' },
          { a: 'hello', b: 'world', c: 1234 },
        ] as const,
        { a: 'hello', b: 'world' } as { a: 'hello'; b: 'world' },
      ),
    ).toEqualTypeOf<
      [
        { readonly a: 'hello'; readonly b: 'world' },
        { readonly a: 'hello'; readonly b: 'world'; readonly c: 1234 },
      ]
    >();
  });

  it('condition value with union of literals', () => {
    expectTypeOf(
      filteredArray(
        [
          { a: 'hello' },
          { b: 'world' },
          { a: 'hello', b: 'world' },
          { a: 'world' },
        ] as const,
        { a: 'hello' } as { a: 'hello' | 'world' },
      ),
    ).toEqualTypeOf<
      [
        { readonly a: 'hello' },
        { readonly a: 'hello'; readonly b: 'world' },
        { readonly a: 'world' },
      ]
    >();
  });
});

describe('condition is an array or primitives', () => {
  it('array of string arrays', () => {
    expectTypeOf(
      filteredArray([] as Array<Array<string>>, [] as Array<string>),
    ).toEqualTypeOf<Array<Array<string>>>();
  });

  it('array of mixed array types', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<Array<string> | Array<number> | Array<boolean>>,
        [] as Array<string>,
      ),
    ).toEqualTypeOf<Array<Array<string>>>();
  });

  it('array containing compatible array types', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<Array<string | number> | Array<boolean>>,
        [] as Array<string>,
      ),
    ).toEqualTypeOf<Array<Array<string>>>();
  });

  it('tuple containing arrays', () => {
    expectTypeOf(
      filteredArray(
        [['a', 'b'], [1, 2], ['c']] as [
          Array<string>,
          Array<number>,
          Array<string>,
        ],
        [] as Array<string>,
      ),
    ).toEqualTypeOf<[Array<string>, Array<string>]>();
  });

  it('complex tuple with arrays in rest position', () => {
    expectTypeOf(
      filteredArray(
        [['a'], ['b'], ['c']] as [
          Array<string>,
          ...Array<Array<string> | Array<number>>,
        ],
        [] as Array<string>,
      ),
    ).toEqualTypeOf<[Array<string>, ...Array<Array<string>>]>();
  });
});

describe('condition is a readonly array of primitives', () => {
  it('array of readonly string arrays', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<ReadonlyArray<string>>,
        [] as ReadonlyArray<string>,
      ),
    ).toEqualTypeOf<Array<ReadonlyArray<string>>>();
  });

  it('array of mixed readonly and mutable arrays', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<ReadonlyArray<string> | Array<string>>,
        [] as ReadonlyArray<string>,
      ),
    ).toEqualTypeOf<Array<ReadonlyArray<string> | Array<string>>>();
  });

  it('array with non-matching readonly arrays', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<ReadonlyArray<number>>,
        [] as ReadonlyArray<string>,
      ),
    ).toEqualTypeOf<[]>();
  });

  it('tuple containing readonly arrays', () => {
    expectTypeOf(
      filteredArray(
        [['a'] as const, [1, 2], ['c'] as const] as [
          ReadonlyArray<string>,
          Array<number>,
          ReadonlyArray<string>,
        ],
        [] as ReadonlyArray<string>,
      ),
    ).toEqualTypeOf<[ReadonlyArray<string>, ReadonlyArray<string>]>();
  });
});

describe('condition is an array of literals', () => {
  it('array of arrays of matching literals', () => {
    expectTypeOf(
      filteredArray([] as Array<Array<'hello'>>, [] as Array<'hello'>),
    ).toEqualTypeOf<Array<Array<'hello'>>>();
  });

  it('array with mixed literal arrays', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<Array<'hello'> | Array<'world'>>,
        [] as Array<'hello'>,
      ),
    ).toEqualTypeOf<Array<Array<'hello'>>>();
  });

  it('array with arrays containing unions of literals', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<Array<'hello' | 'world'>>,
        [] as Array<'hello'>,
      ),
    ).toEqualTypeOf<Array<Array<'hello'>>>();
  });

  it('tuple containing literal arrays', () => {
    expectTypeOf(
      filteredArray(
        [['hello', 'hello'], ['world'], ['hello']] as [
          Array<'hello'>,
          Array<'world'>,
          Array<'hello'>,
        ],
        [] as Array<'hello'>,
      ),
    ).toEqualTypeOf<[Array<'hello'>, Array<'hello'>]>();
  });

  it('readonly arrays of literals', () => {
    expectTypeOf(
      filteredArray(
        [[], []] as [ReadonlyArray<'hello'>, ReadonlyArray<'world'>],
        [] as Array<'hello'>,
      ),
    ).toEqualTypeOf<[]>();

    expectTypeOf(
      filteredArray(
        [[], []] as [ReadonlyArray<'hello'>, ReadonlyArray<'world'>],
        [] as ReadonlyArray<'hello'>,
      ),
    ).toEqualTypeOf<[ReadonlyArray<'hello'>]>();
  });
});

describe('condition is a tuple', () => {
  it('array of matching tuples', () => {
    expectTypeOf(
      filteredArray([] as Array<[string, number]>, ['', 0] as [string, number]),
    ).toEqualTypeOf<Array<[string, number]>>();
  });

  it('array of compatible tuples', () => {
    expectTypeOf(
      filteredArray([] as Array<['hello', 42]>, ['', 0] as [string, number]),
    ).toEqualTypeOf<Array<['hello', 42]>>();
  });

  it('array of incompatible tuples', () => {
    expectTypeOf(
      filteredArray([] as Array<[number, string]>, ['', 0] as [string, number]),
    ).toEqualTypeOf<[]>();
  });

  it('array with mixed tuples and other types', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<[string, number] | Array<string> | number>,
        ['', 0] as [string, number],
      ),
    ).toEqualTypeOf<Array<[string, number]>>();
  });

  it('tuple containing different sized tuples', () => {
    expectTypeOf(
      filteredArray(
        [
          ['a', 1],
          [2, 'b'],
          ['c', 3, true],
        ] as [[string, number], [number, string], [string, number, boolean]],
        ['', 0] as [string, number],
      ),
    ).toEqualTypeOf<[[string, number]]>();
  });

  it('complex nested tuples', () => {
    expectTypeOf(
      filteredArray(
        [[['a', 1]], [['b', 2]]] as const,
        ['', 0] as [string, number],
      ),
    ).toEqualTypeOf<[]>();
  });

  it('readonly tuples', () => {
    expectTypeOf(
      filteredArray(
        [
          ['a', 1],
          [2, 'b'],
        ] as [readonly [string, number], readonly [number, string]],
        ['', 0] as [string, number],
      ),
    ).toEqualTypeOf<[]>();

    expectTypeOf(
      filteredArray(
        [
          ['a', 1],
          [2, 'b'],
        ] as [readonly [string, number], readonly [number, string]],
        ['', 0] as readonly [string, number],
      ),
    ).toEqualTypeOf<[readonly [string, number]]>();
  });
});

describe('condition is a union of primitives', () => {
  it('array with elements matching multiple parts of the union', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<string | number | boolean>,
        '' as string | number,
      ),
    ).toEqualTypeOf<Array<string | number>>();
  });

  it('array with only one union member type', () => {
    expectTypeOf(
      filteredArray([] as Array<string>, '' as string | number),
    ).toEqualTypeOf<Array<string>>();
  });

  it('tuple with mixed primitives', () => {
    expectTypeOf(
      filteredArray(
        ['hello', 42, true] as [string, number, boolean],
        '' as string | number,
      ),
    ).toEqualTypeOf<[string, number]>();
  });

  it('tuple with literal types that extend union members', () => {
    expectTypeOf(
      filteredArray(['hello', 42, true] as const, '' as string | number),
    ).toEqualTypeOf<['hello', 42]>();
  });

  it('tuple with union of literals', () => {
    expectTypeOf(
      filteredArray(
        ['', '', 123] as [string | number, string | boolean, number | boolean],
        'cat' as string | number,
      ),
    ).toEqualTypeOf<
      | [string, number]
      | [number, string]
      | [string]
      | [string, string, number]
      | [number]
      | [string, string]
      | [number, string, number]
      | [number, number]
    >();
  });
});

describe('condition is a union of literals', () => {
  it('array with elements matching any part of the union', () => {
    expectTypeOf(
      filteredArray(
        ['cat', 'dog', 'fish'] as Array<string>,
        'cat' as 'cat' | 'dog',
      ),
    ).toEqualTypeOf<Array<'cat' | 'dog'>>();
  });

  it('array with union literals only', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<'cat' | 'dog' | 'fish'>,
        'cat' as 'cat' | 'dog',
      ),
    ).toEqualTypeOf<Array<'cat' | 'dog'>>();
  });

  it('tuple with mixed elements', () => {
    expectTypeOf(
      filteredArray(['cat', 'fish', 'dog'] as const, 'cat' as 'cat' | 'dog'),
    ).toEqualTypeOf<['cat', 'dog']>();
  });

  it('tuple with union of literals', () => {
    expectTypeOf(
      filteredArray(
        ['cat', 'cat', 'dog'] as ['cat' | 'dog', 'cat' | 'foo', 'dog' | 'bar'],
        'cat' as 'cat' | 'dog',
      ),
    ).toEqualTypeOf<
      | ['cat']
      | ['dog']
      | ['cat', 'dog']
      | ['cat', 'cat', 'dog']
      | ['cat', 'cat']
      | ['dog', 'cat']
      | ['dog', 'dog']
      | ['dog', 'cat', 'dog']
    >();
  });
});

describe('condition is a discriminated union', () => {
  it('array with discriminated union elements', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: 'cat'; b: number } | { a: 'dog'; c: boolean }>,
        { a: 'cat' } as { a: 'cat' } | { a: 'dog' },
      ),
    ).toEqualTypeOf<
      Array<{ a: 'cat'; b: number } | { a: 'dog'; c: boolean }>
    >();
  });

  it('tuple with mixed discriminated types', () => {
    expectTypeOf(
      filteredArray(
        [
          { a: 'cat', b: 1 },
          { a: 'dog', c: true },
          { a: 'cat', b: 2 },
        ] as const,
        { a: 'cat' } as { a: 'cat' } | { a: 'dog' },
      ),
    ).toEqualTypeOf<
      [
        { readonly a: 'cat'; readonly b: 1 },
        { readonly a: 'dog'; readonly c: true },
        { readonly a: 'cat'; readonly b: 2 },
      ]
    >();
  });

  it('filtering with discriminator only', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: 'cat'; b: number } | { a: 'dog'; c: boolean }>,
        { a: 'cat' } as { a: 'cat' | 'dog' },
      ),
    ).toEqualTypeOf<
      Array<{ a: 'cat'; b: number } | { a: 'dog'; c: boolean }>
    >();
  });
});

describe('disjoint object types ({ a: string } | { b: number })', () => {
  it('array with disjoint union elements', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: string } | { b: number }>,
        { a: '' } as { a: string } | { b: number },
      ),
    ).toEqualTypeOf<Array<{ a: string } | { b: number }>>();
  });

  it('filtering for only one variant', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: string } | { b: number }>,
        { a: '' } as { a: string },
      ),
    ).toEqualTypeOf<Array<{ a: string }>>();
  });

  it('array with objects having both properties', () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: string } | { b: number } | { a: string; b: number }>,
        { a: '' } as { a: string } | { b: number },
      ),
    ).toEqualTypeOf<
      Array<{ a: string } | { b: number } | { a: string; b: number }>
    >();
  });

  it('tuple with mixed disjoint types', () => {
    expectTypeOf(
      filteredArray(
        [{ a: 'hello' }, { b: 42 }, { a: 'world', b: 123 }] as const,
        { b: 0 } as { a: string } | { b: number },
      ),
    ).toEqualTypeOf<
      [
        { readonly a: 'hello' },
        { readonly b: 42 },
        { readonly a: 'world'; readonly b: 123 },
      ]
    >();
  });
});

describe('complex nested union conditions', () => {
  it('union of arrays', () => {
    expectTypeOf(
      filteredArray(
        [['a'], [1], ['b']] as [Array<string>, Array<number>, Array<string>],
        [] as Array<string> | Array<number>,
      ),
    ).toEqualTypeOf<[Array<string>, Array<number>, Array<string>]>();
  });

  it('union of tuples with different structures', () => {
    expectTypeOf(
      filteredArray(
        [
          ['a', 1],
          [true, 'b'],
          [42, 'c'],
        ] as [[string, number], [boolean, string], [number, string]],
        ['', 0] as [string, number] | [boolean, string],
      ),
    ).toEqualTypeOf<[[string, number], [boolean, string]]>();
  });
});

describe('tuples with optional elements', () => {
  it('removes the partialness once filtered', () => {
    expectTypeOf(
      filteredArray([] as [number?, string?], '' as string),
    ).toEqualTypeOf<[string?]>();
  });

  it('multiple matches', () => {
    expectTypeOf(
      filteredArray([] as [number?, string?, number?, string?], '' as string),
    ).toEqualTypeOf<[string?, string?]>();
  });

  it('literal unions, primitive condition', () => {
    expectTypeOf(
      filteredArray(
        [] as [('hello' | 'world')?, ('foo' | 'bar')?],
        '' as string,
      ),
    ).toEqualTypeOf<
      | ['hello'?, 'foo'?]
      | ['world'?, 'foo'?]
      | ['hello'?, 'bar'?]
      | ['world'?, 'bar'?]
    >();
  });

  it('literal unions, matching condition', () => {
    expectTypeOf(
      filteredArray(
        [] as [('hello' | 'world')?, ('foo' | 'bar')?],
        'hello' as 'hello' | 'foo',
      ),
    ).toEqualTypeOf<[] | ['hello'?, 'foo'?] | ['hello'?] | ['foo'?]>();
  });

  it('primitive items, literal union condition', () => {
    expectTypeOf(
      filteredArray([] as [string?, string?], 'hello' as 'hello' | 'foo'),
    ).toEqualTypeOf<
      | ['hello'?, 'foo'?]
      | []
      | ['hello'?]
      | ['foo'?]
      | ['hello'?, 'hello'?]
      | ['foo'?, 'hello'?]
      | ['foo'?, 'foo'?]
    >();
  });
});

it('null filtering', () => {
  expectTypeOf(
    filteredArray([] as Array<string | undefined>, '' as string),
  ).toEqualTypeOf<Array<string>>();
});

// @see https://github.com/remeda/remeda/issues/1231
it('prop with literal union value filtered by overlapping value (issue #1231)', () => {
  expectTypeOf(
    filteredArray([] as Array<{ a: 'cat' | 'dog'; b: string }>, {
      a: 'cat' as const,
    }),
  ).branded.toEqualTypeOf<Array<{ a: 'cat'; b: string }>>();
});

it('prop with literal union value filtered by disjoint value', () => {
  expectTypeOf(
    filteredArray([] as Array<{ a: 'cat' | 'dog'; b: string }>, {
      a: 'bird' as const,
    }),
  ).toEqualTypeOf<[]>();
});
