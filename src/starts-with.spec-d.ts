import { describe, expectTypeOf, it } from 'vitest';
import { partition } from './partition';
import { startsWith } from './starts-with';

describe('data-first', () => {
  it('doesn\'t narrow on \'string\' prefix', () => {
    const data = 'foobar' as string;
    // eslint-disable-next-line sonar/no-all-duplicated-branches
    if (startsWith(data, 'foo' as string)) {
      expectTypeOf(data).toEqualTypeOf<string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  it('const data that matches', () => {
    const data = 'foobar' as const;
    if (startsWith(data, 'foo')) {
      expectTypeOf(data).toEqualTypeOf<'foobar'>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('const data that doesn\'t match', () => {
    const data = 'helloworld' as const;
    if (startsWith(data, 'foo')) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'helloworld'>();
    }
  });

  it('primitive string data', () => {
    const data = 'foobar' as string;
    if (startsWith(data, 'foo')) {
      expectTypeOf(data).toEqualTypeOf<`foo${string}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  it('template literal data that matches', () => {
    const data = 'foo_1' as `foo_${number}`;
    if (startsWith(data, 'foo')) {
      expectTypeOf(data).toEqualTypeOf<`foo_${number}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('template literal data that doesn\'t match', () => {
    const data = 'foo_1' as `foo_${number}`;
    if (startsWith(data, 'hello')) {
      // These should be equivalent to `never` but TypeScript doesn't infer
      // that...
      expectTypeOf(data).toEqualTypeOf<`foo_${number}` & `hello${string}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`foo_${number}`>();
    }
  });

  it('literal union', () => {
    const data = 'cat' as 'cat' | 'dog';
    if (startsWith(data, 'c')) {
      expectTypeOf(data).toEqualTypeOf<'cat'>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'dog'>();
    }
  });

  it('template union', () => {
    const data = 'cat' as `cat_${number}` | `dog_${boolean}`;
    if (startsWith(data, 'c')) {
      expectTypeOf(data).toEqualTypeOf<`cat_${number}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`dog_${boolean}`>();
    }
  });
});

describe('data-last', () => {
  it('doesn\'t narrow on \'string\' prefix', () => {
    const [yes, no] = partition([] as Array<string>, startsWith('foo' as string));

    expectTypeOf(yes).toEqualTypeOf<Array<string>>();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });

  it('const data that matches', () => {
    const [yes, no] = partition([] as Array<'foobar'>, startsWith('foo'));

    expectTypeOf(yes).toEqualTypeOf<Array<'foobar'>>();
    expectTypeOf(no).toEqualTypeOf<Array<never>>();
  });

  it('const data that doesn\'t match', () => {
    const [yes, no] = partition([] as Array<'helloworld'>, startsWith('foo'));

    expectTypeOf(yes).toEqualTypeOf<Array<never>>();
    expectTypeOf(no).toEqualTypeOf<Array<'helloworld'>>();
  });

  it('primitive string data', () => {
    const [yes, no] = partition([] as Array<string>, startsWith('foo'));

    expectTypeOf(yes).toEqualTypeOf<Array<`foo${string}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });

  it('template literal data that matches', () => {
    const [yes, no] = partition([] as Array<`foo_${number}`>, startsWith('foo'));

    expectTypeOf(yes).branded.toEqualTypeOf<Array<`foo_${number}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<never>>();
  });

  it('template literal data that doesn\'t match', () => {
    const [yes, no] = partition([] as Array<`foo_${number}`>, startsWith('hello'));

    expectTypeOf(yes).toEqualTypeOf<
      // These should be equivalent to `never` but TypeScript doesn't infer
      // that...
      Array<`foo_${number}` & `hello${string}`>
    >();
    expectTypeOf(no).toEqualTypeOf<Array<`foo_${number}`>>();
  });

  it('literal union', () => {
    const [yes, no] = partition([] as Array<'cat' | 'dog'>, startsWith('c'));

    expectTypeOf(yes).toEqualTypeOf<Array<'cat'>>();
    expectTypeOf(no).toEqualTypeOf<Array<'dog'>>();
  });

  it('template union', () => {
    const [yes, no] = partition(
      [] as Array<`cat_${number}` | `dog_${boolean}`>,
      startsWith('c'),
    );

    expectTypeOf(yes).branded.toEqualTypeOf<Array<`cat_${number}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<`dog_${boolean}`>>();
  });
});
