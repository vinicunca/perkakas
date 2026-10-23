import { expectTypeOf, it } from 'vitest';
import { mergeDeep } from './merge-deep';

it('trivially merges disjoint objects', () => {
  const result = mergeDeep({ foo: 'bar' }, { bar: 'baz' });

  expectTypeOf(result).toEqualTypeOf<{ foo: string; bar: string }>();
});

it('merges fully overlapping types', () => {
  const result = mergeDeep({ foo: 'bar' }, { foo: 'baz' });

  expectTypeOf(result).toEqualTypeOf<{ foo: string }>();
});

it('merges semi-overlapping types', () => {
  const result = mergeDeep({ foo: 'bar', x: 1 }, { foo: 'baz', y: 2 });

  expectTypeOf(result).toEqualTypeOf<{ foo: string; x: number; y: number }>();
});

it('deeply merges', () => {
  const result = mergeDeep({
    foo: { bar: 'bar' },
  }, {
    foo: { qux: 'qux' },
  });

  expectTypeOf(result).toEqualTypeOf<{ foo: { bar: string; qux: string } }>();
});

it('overrides types', () => {
  const a = {
    foo: { bar: 'baz' },
  };
  const b = { foo: 'qux' };

  const resultAB = mergeDeep(a, b);

  expectTypeOf(resultAB).toEqualTypeOf<{ foo: string }>();

  const resultBA = mergeDeep(b, a);

  expectTypeOf(resultBA).toEqualTypeOf<{ foo: { bar: string } }>();
});

it('doesn\'t spread arrays', () => {
  const result = mergeDeep(
    {
      foo: ['bar'],
    } as const,
    {
      foo: ['baz'],
    } as const,
  );

  expectTypeOf(result).toEqualTypeOf<{ readonly foo: readonly ['baz'] }>();
});

it('doesn\'t recurse into arrays', () => {
  const result = mergeDeep(
    {
      foo: [
        { bar: 'baz', x: 123 },
      ],
    },
    {
      foo: [
        { bar: 'hello, world', y: 456 },
      ],
    },
  );

  expectTypeOf(result).toEqualTypeOf<{
    foo: Array<{ bar: string; y: number }>;
  }>();
});

it('works with interfaces', () => {
  interface Foo {
    a: string;
    b: number;
  }

  interface Bar {
    a: string;
    c: boolean;
  }

  expectTypeOf(
    mergeDeep({ a: 'foo', b: 123 } as Foo, { a: 'bar', c: true } as Bar),
  ).toEqualTypeOf<{ a: string; b: number; c: boolean }>();
});
