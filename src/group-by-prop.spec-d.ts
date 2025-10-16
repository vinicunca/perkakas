import type { EmptyObject } from 'type-fest';
import { describe, expectTypeOf, it } from 'vitest';
import { groupByProp } from './group-by-prop';

const SYMBOL = Symbol('sym');
describe('grouping prop types', () => {
  it('primitive strings', () => {
    expectTypeOf(
      groupByProp([] as Array<{ a: string }>, 'a'),
    ).branded.toEqualTypeOf<
      Record<string, [{ a: string }, ...Array<{ a: string }>]>
    >();
  });

  it('literal strings', () => {
    expectTypeOf(
      groupByProp(
        [
          { a: 'cat', b: 123 },
          { a: 'dog', b: 456 },
          { a: 'dog', b: 789 },
          { a: 'cat', b: 101 },
        ] as const,
        'a',
      ),
    ).toEqualTypeOf<{
      cat: [
        { readonly a: 'cat'; readonly b: 123 },
        { readonly a: 'cat'; readonly b: 101 },
      ];
      dog: [
        { readonly a: 'dog'; readonly b: 456 },
        { readonly a: 'dog'; readonly b: 789 },
      ];
    }>();
  });

  it('literal numbers', () => {
    expectTypeOf(
      groupByProp(
        [
          { a: 'cat', b: 123 },
          { a: 'dog', b: 456 },
        ] as const,
        'b',
      ),
    ).toEqualTypeOf<{
      123: [{ readonly a: 'cat'; readonly b: 123 }];
      456: [{ readonly a: 'dog'; readonly b: 456 }];
    }>();
  });

  it('symbol', () => {
    expectTypeOf(
      groupByProp(
        [
          { [SYMBOL]: 'cat', b: 123 },
          { [SYMBOL]: 'dog', b: 456 },
        ] as const,
        SYMBOL,
      ),
    ).toEqualTypeOf<{
      cat: [{ readonly [SYMBOL]: 'cat'; readonly b: 123 }];
      dog: [{ readonly [SYMBOL]: 'dog'; readonly b: 456 }];
    }>();
  });
});

it('values which might not exist in the input are optional in the output', () => {
  expectTypeOf(
    groupByProp(
      [{ a: 'cat' }] as [{ a: 'cat' }, { a: 'mouse' }?, ...Array<{ a: 'dog' }>],
      'a',
    ),
  ).branded.toEqualTypeOf<{
    cat: [{ a: 'cat' }];
    dog?: [{ a: 'dog' }, ...Array<{ a: 'dog' }>];
    mouse?: [{ a: 'mouse' }];
  }>();
});

describe('enforces strong typing on the grouping prop', () => {
  it('typo in prop name', () => {
    groupByProp(
      [{ a: 'hello' }] as const,
      // @ts-expect-error [ts2345] -- "typo" isn't a valid prop name
      'typo',
    );
  });

  it('prop is not groupable', () => {
    groupByProp(
      [{ a: new Date() }] as const,
      // @ts-expect-error [ts2345] -- "a" can't be used to group the array
      'a',
    );
  });

  it('prop is only groupable for some of the elements', () => {
    groupByProp(
      [{ a: 'hello' }, { a: new Date() }] as const,
      // @ts-expect-error [ts2345] -- "a" cannot be used to group the array
      // because it can sometimes be a Date
      'a',
    );
  });

  it('allows grouping on a prop that isn\'t in all elements', () => {
    groupByProp([{ a: 'hello' }, { b: 123 }] as const, 'a');
  });

  it('allows grouping on possibly undefined props', () => {
    groupByProp([] as Array<{ a: string | undefined }>, 'a');
  });
});

it('group by prop that doesn\'t exist on all items', () => {
  expectTypeOf(
    groupByProp([{ a: 'cat' }, { b: 'dog' }] as const, 'a'),
  ).toEqualTypeOf<{ cat: [{ readonly a: 'cat' }] }>();
});

describe('union of array types', () => {
  it('when they share the grouping prop', () => {
    expectTypeOf(
      groupByProp(
        [] as
        | Array<{ a: 'cat'; cat: number }>
        | Array<{ a: 'dog'; dog: boolean }>,
        'a',
      ),
    ).branded.toEqualTypeOf<
      | {
        cat?: [
          { a: 'cat'; cat: number },
          ...Array<{ a: 'cat'; cat: number }>,
        ];
      }
      | {
        dog?: [
          { a: 'dog'; dog: boolean },
          ...Array<{ a: 'dog'; dog: boolean }>,
        ];
      }
    >();
  });

  it('when they don\'t share the grouping prop', () => {
    expectTypeOf(
      groupByProp([] as Array<{ a: string }> | Array<{ b: number }>, 'a'),
    ).branded.toEqualTypeOf<
      EmptyObject | Record<string, [{ a: string }, ...Array<{ a: string }>]>
    >();
  });

  it('empty tuple', () => {
    expectTypeOf(groupByProp([] as [{ a: string }] | [], 'a')).toEqualTypeOf<
      EmptyObject | { [x: string]: [{ a: string }] }
    >();
  });
});

it('all values are undefined', () => {
  expectTypeOf(
    groupByProp([] as Array<{ a: undefined }>, 'a'),
  ).toEqualTypeOf<EmptyObject>();
});
