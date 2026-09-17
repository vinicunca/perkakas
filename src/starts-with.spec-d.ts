/* eslint-disable sonar/no-all-duplicated-branches */
/* eslint-disable ts/explicit-function-return-type --
 * Our "generics" tests can only be constructed via generic function wrappers,
 * but because we only care about how the parameters are passed through to our
 * types, we don't care about the stricter rules we have for writing proper
 * functions.
 */

import { describe, expectTypeOf, it } from 'vitest';
import { $typed } from '../test/$typed';
import { filter } from './filter';
import { isNot } from './is-not';
import { map } from './map';
import { partition } from './partition';
import { pipe } from './pipe';
import { startsWith } from './starts-with';

describe('data-first', () => {
  it('doesn\'t narrow on \'string\' prefix', () => {
    const data = '' as string;

    expectTypeOf(startsWith(data, '' as string)).toEqualTypeOf<boolean>();

    if (startsWith(data, '' as string)) {
      expectTypeOf(data).toEqualTypeOf<string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  it('doesn\'t narrow a literal union on \'string\' prefix', () => {
    const data = 'cat' as 'cat' | 'dog';

    expectTypeOf(startsWith(data, '' as string)).toEqualTypeOf<boolean>();

    if (startsWith(data, '' as string)) {
      expectTypeOf(data).toEqualTypeOf<'cat' | 'dog'>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'cat' | 'dog'>();
    }
  });

  it('const data that matches', () => {
    expectTypeOf(startsWith('foobar' as const, 'foo')).toEqualTypeOf<true>();
  });

  it('prefix equal to the data', () => {
    expectTypeOf(startsWith('foo' as const, 'foo')).toEqualTypeOf<true>();
  });

  it('primitive string data', () => {
    const data = '' as string;
    if (startsWith(data, 'foo')) {
      expectTypeOf(data).toEqualTypeOf<`foo${string}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  it('template literal data that matches', () => {
    expectTypeOf(
      startsWith('foo_1' as `foo_${number}`, 'foo'),
    ).toEqualTypeOf<true>();
  });

  it('literal union', () => {
    const data = 'cat' as 'cat' | 'dog';
    if (startsWith(data, 'c')) {
      expectTypeOf(data).toEqualTypeOf<'cat'>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'dog'>();
    }
  });

  it('empty prefix', () => {
    expectTypeOf(startsWith('cat' as 'cat' | 'dog', '')).toEqualTypeOf<true>();
  });

  it('empty prefix on primitive string data', () => {
    expectTypeOf(startsWith('' as string, '')).toEqualTypeOf<true>();
  });

  it('template union', () => {
    const data = 'cat' as `cat_${number}` | `dog_${boolean}`;
    if (startsWith(data, 'c')) {
      expectTypeOf(data).toEqualTypeOf<`cat_${number}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`dog_${boolean}`>();
    }
  });

  describe('compiles inside a generic wrapper', () => {
    // Dead prefixes (#1432) are rejected through a conditional on the
    // parameter type. While `T` or `Prefix` is still an unresolved type
    // parameter that conditional stays deferred, and TypeScript accepts the
    // argument only if every branch it can't rule out accepts it; a live
    // rejection branch fails the whole call (ts2769). The call inside each
    // wrapper is what's under test; the assertion pins which overload it
    // resolved to.

    it('generic data, literal prefix', () => {
      const startsWithFoo = <T extends string>(data: T) =>
        startsWith(data, 'foo') ? data : undefined;

      // The narrowing overload is the one picked through the wrapper; falling
      // through to the boolean overload would leave `data` a plain `string`.
      expectTypeOf(startsWithFoo($typed<string>())).toEqualTypeOf<
        `foo${string}` | undefined
      >();
    });

    it('generic prefix, primitive data', () => {
      const hasPrefix = <Prefix extends string>(data: string, prefix: Prefix) =>
        startsWith(data, prefix);

      expectTypeOf(hasPrefix('foobar', 'foo')).toEqualTypeOf<boolean>();
    });

    it('generic prefix, literal data', () => {
      const hasPrefix = <Prefix extends string>(prefix: Prefix) =>
        startsWith($typed<'cat' | 'dog'>(), prefix);

      // An unresolved prefix can't narrow anything, so the boolean overload is
      // the right one.
      expectTypeOf(hasPrefix('bird')).toEqualTypeOf<boolean>();
    });

    it('generic data, primitive prefix', () => {
      const hasPrefix = <T extends string>(data: T, prefix: string) =>
        startsWith(data, prefix);

      expectTypeOf(hasPrefix('foobar', 'foo')).toEqualTypeOf<boolean>();
    });

    it('generic data and prefix', () => {
      const hasPrefix = <T extends string, Prefix extends string>(
        data: T,
        prefix: Prefix,
      ) => startsWith(data, prefix);

      expectTypeOf(hasPrefix('foobar', 'foo')).toEqualTypeOf<boolean>();
    });

    it('data constrained by the prefix', () => {
      const startsWithFoo = <T extends `foo${string}`>(data: T) =>
        startsWith(data, 'foo') ? undefined : data;

      // The narrowing overload empties the falsy branch; the boolean overload
      // would leave `data` as `T` there.
      expectTypeOf(startsWithFoo('foobar')).toEqualTypeOf<undefined>();
    });
  });

  it('literal union prefix', () => {
    const data = '' as string;
    if (startsWith(data, 'foo' as 'foo' | 'baz')) {
      expectTypeOf(data).toEqualTypeOf<`foo${string}` | `baz${string}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  it('doesn\'t narrow when the prefix union splits the data', () => {
    const data = 'foobar' as 'foobar' | 'hello' | 'world';

    expectTypeOf(
      startsWith(data, 'foo' as 'foo' | 'he'),
    ).toEqualTypeOf<boolean>();

    if (startsWith(data, 'foo' as 'foo' | 'he')) {
      expectTypeOf(data).toEqualTypeOf<'foobar' | 'hello' | 'world'>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'foobar' | 'hello' | 'world'>();
    }
  });

  it('doesn\'t narrow when only some prefixes are disjoint', () => {
    const data = 'cat' as 'cat' | 'dog';

    expectTypeOf(
      startsWith(data, 'c' as 'c' | 'bird'),
    ).toEqualTypeOf<boolean>();

    if (startsWith(data, 'c' as 'c' | 'bird')) {
      expectTypeOf(data).toEqualTypeOf<'cat' | 'dog'>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'cat' | 'dog'>();
    }
  });

  it('narrows a union when every data member matches all prefixes or none', () => {
    const data = 'catcat' as 'catcat' | 'dog';
    if (startsWith(data, 'cat' as 'cat' | 'c')) {
      expectTypeOf(data).toEqualTypeOf<'catcat'>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'dog'>();
    }
  });

  it('doesn\'t narrow a matching const to \'never\' on a union prefix', () => {
    const data = 'foobar' as const;

    expectTypeOf(
      startsWith(data, 'foo' as 'foo' | 'he'),
    ).toEqualTypeOf<boolean>();

    if (startsWith(data, 'foo' as 'foo' | 'he')) {
      expectTypeOf(data).toEqualTypeOf<'foobar'>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'foobar'>();
    }
  });

  it('union prefix where every member matches', () => {
    expectTypeOf(
      startsWith('foobar' as const, 'foo' as 'foo' | 'f'),
    ).toEqualTypeOf<true>();
  });

  it('union prefix mixing a literal and a template member', () => {
    expectTypeOf(
      startsWith('foobar' as const, 'foo' as 'foo' | `${number}_`),
    ).toEqualTypeOf<boolean>();
  });

  it('every member of a literal union data matches a literal prefix', () => {
    expectTypeOf(
      startsWith('foobar' as 'foobar' | 'foobaz', 'foo'),
    ).toEqualTypeOf<true>();
  });

  it('every member of a literal union data matches every member of a union prefix', () => {
    expectTypeOf(
      startsWith('foobar' as 'foobar' | 'foobaz', 'foo' as 'foo' | 'f'),
    ).toEqualTypeOf<true>();
  });

  it('template prefix', () => {
    const data = '' as string;
    if (startsWith(data, '1' as `${number}`)) {
      expectTypeOf(data).toEqualTypeOf<`${number}${string}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  it('doesn\'t narrow on a template prefix that splits the data', () => {
    const data = '1_cat' as '1_cat' | 'dog';

    expectTypeOf(
      startsWith(data, '1_' as `${number}_`),
    ).toEqualTypeOf<boolean>();

    if (startsWith(data, '1_' as `${number}_`)) {
      expectTypeOf(data).toEqualTypeOf<'1_cat' | 'dog'>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'1_cat' | 'dog'>();
    }
  });

  it('doesn\'t narrow on a template prefix on template data', () => {
    const data = 'bar_1' as `bar_${number}`;

    expectTypeOf(
      startsWith(data, 'bar_' as `${string}_`),
    ).toEqualTypeOf<boolean>();

    if (startsWith(data, 'bar_' as `${string}_`)) {
      expectTypeOf(data).toEqualTypeOf<`bar_${number}`>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`bar_${number}`>();
    }
  });

  it('doesn\'t narrow when a union prefix contains an empty string', () => {
    const data = 'cat' as 'cat' | 'dog';

    expectTypeOf(startsWith(data, '' as '' | 'z')).toEqualTypeOf<boolean>();

    if (startsWith(data, '' as '' | 'z')) {
      expectTypeOf(data).toEqualTypeOf<'cat' | 'dog'>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'cat' | 'dog'>();
    }
  });

  it('template union prefix', () => {
    const data = '' as string;
    if (startsWith(data, '1_' as `${number}_` | `${number}-`)) {
      expectTypeOf(data).toEqualTypeOf<
        `${number}_${string}` | `${number}-${string}`
      >();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });
});

describe('data-last', () => {
  it('doesn\'t narrow on \'string\' prefix', () => {
    const [yes, no] = partition([] as Array<string>, startsWith('' as string));

    expectTypeOf(yes).toEqualTypeOf<Array<string>>();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });

  it('doesn\'t narrow a literal union on \'string\' prefix', () => {
    const [yes, no] = partition(
      [] as Array<'cat' | 'dog'>,
      startsWith('' as string),
    );

    expectTypeOf(yes).toEqualTypeOf<Array<'cat' | 'dog'>>();
    expectTypeOf(no).toEqualTypeOf<Array<'cat' | 'dog'>>();
  });

  it('const data that matches', () => {
    expectTypeOf(
      pipe('foobar' as const, startsWith('foo')),
    ).toEqualTypeOf<true>();
  });

  it('prefix equal to the data', () => {
    expectTypeOf(pipe('foo' as const, startsWith('foo'))).toEqualTypeOf<true>();
  });

  it('primitive string data', () => {
    const [yes, no] = partition([] as Array<string>, startsWith('foo'));

    expectTypeOf(yes).toEqualTypeOf<Array<`foo${string}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });

  it('template literal data that matches', () => {
    expectTypeOf(
      pipe('foo_1' as `foo_${number}`, startsWith('foo')),
    ).toEqualTypeOf<true>();
  });

  it('literal union', () => {
    const [yes, no] = partition([] as Array<'cat' | 'dog'>, startsWith('c'));

    expectTypeOf(yes).toEqualTypeOf<Array<'cat'>>();
    expectTypeOf(no).toEqualTypeOf<Array<'dog'>>();
  });

  it('empty prefix', () => {
    expectTypeOf(
      pipe('cat' as 'cat' | 'dog', startsWith('')),
    ).toEqualTypeOf<true>();
  });

  it('empty prefix on primitive string data', () => {
    expectTypeOf(pipe('' as string, startsWith(''))).toEqualTypeOf<true>();
  });

  it('guaranteed prefix through a callback consumer', () => {
    expectTypeOf(map([] as Array<'foobar'>, startsWith('foo'))).toEqualTypeOf<
      Array<true>
    >();
  });

  it('guaranteed prefix through a filtering consumer', () => {
    const [yes, no] = partition([] as Array<'foobar'>, startsWith('foo'));

    expectTypeOf(yes).toEqualTypeOf<Array<'foobar'>>();
    expectTypeOf(no).toEqualTypeOf<[]>();
  });

  it('template union', () => {
    const [yes, no] = partition(
      [] as Array<`cat_${number}` | `dog_${boolean}`>,
      startsWith('c'),
    );

    expectTypeOf(yes).branded.toEqualTypeOf<Array<`cat_${number}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<`dog_${boolean}`>>();
  });

  it('type parameters inferred through composition', () => {
    expectTypeOf(
      filter([] as Array<'cat' | 'dog'>, isNot(startsWith('c'))),
    ).toEqualTypeOf<Array<'dog'>>();
  });

  it('guaranteed prefix negated through composition', () => {
    expectTypeOf(
      filter([] as Array<'cat' | 'dog'>, isNot(startsWith(''))),
    ).toEqualTypeOf<[]>();
  });

  it('generic data', () => {
    const startsWithFooAll = <T extends string>(data: ReadonlyArray<T>) =>
      filter(data, startsWith('foo'));

    expectTypeOf(startsWithFooAll([] as Array<string>)).toEqualTypeOf<
      Array<`foo${string}`>
    >();
  });

  it('literal union prefix', () => {
    const [yes, no] = partition(
      [] as Array<string>,
      startsWith('foo' as 'foo' | 'baz'),
    );

    expectTypeOf(yes).toEqualTypeOf<Array<`foo${string}` | `baz${string}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });

  it('doesn\'t narrow when the prefix union splits the data', () => {
    const [yes, no] = partition(
      [] as Array<'foobar' | 'hello' | 'world'>,
      startsWith('foo' as 'foo' | 'he'),
    );

    expectTypeOf(yes).toEqualTypeOf<Array<'foobar' | 'hello' | 'world'>>();
    expectTypeOf(no).toEqualTypeOf<Array<'foobar' | 'hello' | 'world'>>();
  });

  it('doesn\'t narrow when only some prefixes are disjoint', () => {
    const [yes, no] = partition(
      [] as Array<'cat' | 'dog'>,
      startsWith('c' as 'c' | 'bird'),
    );

    expectTypeOf(yes).toEqualTypeOf<Array<'cat' | 'dog'>>();
    expectTypeOf(no).toEqualTypeOf<Array<'cat' | 'dog'>>();
  });

  it('doesn\'t narrow a matching const to \'never\' on a union prefix', () => {
    const [yes, no] = partition(
      [] as Array<'foobar'>,
      startsWith('foo' as 'foo' | 'he'),
    );

    expectTypeOf(yes).toEqualTypeOf<Array<'foobar'>>();
    expectTypeOf(no).toEqualTypeOf<Array<'foobar'>>();
  });

  it('union prefix where every member matches', () => {
    expectTypeOf(
      pipe('foobar' as const, startsWith('foo' as 'foo' | 'f')),
    ).toEqualTypeOf<true>();
  });

  it('union prefix mixing a literal and a template member', () => {
    expectTypeOf(
      pipe('foobar' as const, startsWith('foo' as 'foo' | `${number}_`)),
    ).toEqualTypeOf<boolean>();
  });

  it('guaranteed prefix on a literal union data through a callback consumer', () => {
    expectTypeOf(
      map([] as Array<'foobar' | 'foobaz'>, startsWith('foo')),
    ).toEqualTypeOf<Array<true>>();
  });

  it('template prefix', () => {
    const [yes, no] = partition([] as Array<string>, startsWith('1' as `${number}`));

    expectTypeOf(yes).toEqualTypeOf<Array<`${number}${string}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });

  it('doesn\'t narrow on a template prefix that splits the data', () => {
    const [yes, no] = partition(
      [] as Array<'1_cat' | 'dog'>,
      startsWith('1_' as `${number}_`),
    );

    expectTypeOf(yes).toEqualTypeOf<Array<'1_cat' | 'dog'>>();
    expectTypeOf(no).toEqualTypeOf<Array<'1_cat' | 'dog'>>();
  });

  it('doesn\'t narrow on a template prefix on template data', () => {
    const [yes, no] = partition(
      [] as Array<`bar_${number}`>,
      startsWith('bar_' as `${string}_`),
    );

    expectTypeOf(yes).toEqualTypeOf<Array<`bar_${number}`>>();
    expectTypeOf(no).toEqualTypeOf<Array<`bar_${number}`>>();
  });

  it('doesn\'t narrow when a union prefix contains an empty string', () => {
    const [yes, no] = partition(
      [] as Array<'cat' | 'dog'>,
      startsWith('' as '' | 'z'),
    );

    expectTypeOf(yes).toEqualTypeOf<Array<'cat' | 'dog'>>();
    expectTypeOf(no).toEqualTypeOf<Array<'cat' | 'dog'>>();
  });

  it('template union prefix', () => {
    const [yes, no] = partition(
      [] as Array<string>,
      startsWith('1_' as `${number}_` | `${number}-`),
    );

    expectTypeOf(yes).toEqualTypeOf<
      Array<`${number}_${string}` | `${number}-${string}`>
    >();
    expectTypeOf(no).toEqualTypeOf<Array<string>>();
  });
});

describe('reject disjoint prefixes (#1432)', () => {
  it('const data that doesn\'t match', () => {
    startsWith(
      'helloworld' as const,
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      'foo',
    );
  });

  it('prefix longer than the data', () => {
    startsWith(
      'foo' as const,
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      'foobar',
    );
  });

  it('literal union where no member matches', () => {
    startsWith(
      'cat' as 'cat' | 'dog',
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      'bird',
    );
  });

  it('union prefix where no member matches', () => {
    startsWith(
      'cat' as 'cat' | 'dog',
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      'bird' as 'bird' | 'fish',
    );
  });

  it('template prefix that no literal matches', () => {
    startsWith(
      'cat' as 'cat' | 'dog',
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      '1_' as `${number}_`,
    );
  });

  it('union prefix mixing a literal and a template member where neither matches', () => {
    startsWith(
      'foobar' as const,
      // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
      'x' as 'x' | `${number}_`,
    );
  });

  describe('data-last', () => {
    it('const data that doesn\'t match', () => {
      filter(
        [] as Array<'helloworld'>,
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        startsWith('foo'),
      );
    });

    it('prefix longer than the data', () => {
      filter(
        [] as Array<'foo'>,
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        startsWith('foobar'),
      );
    });

    it('literal union where no member matches', () => {
      filter(
        [] as Array<'cat' | 'dog'>,
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        startsWith('bird'),
      );
    });

    it('union prefix where no member matches', () => {
      filter(
        [] as Array<'cat' | 'dog'>,
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        startsWith('bird' as 'bird' | 'fish'),
      );
    });

    it('template prefix that no literal matches', () => {
      filter(
        [] as Array<'cat' | 'dog'>,
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        startsWith('1_' as `${number}_`),
      );
    });

    it('in pipe', () => {
      pipe(
        // @ts-expect-error [ts2345] -- Intentional! this is what we're testing...
        'cat' as 'cat' | 'dog',
        startsWith('bird'),
      );
    });

    it('native array methods', () => {
      // eslint-disable-next-line unicorn/no-unused-array-method-return -- Intentional! just used for testing...
      ([] as Array<'cat' | 'dog'>).filter(
        // @ts-expect-error [ts2769] -- Intentional! this is what we're testing...
        startsWith('bird'),
      );
    });
  });
});

describe('known issues!', () => {
  describe('dead prefixes aren\'t rejected through a type parameter', () => {
    it('data-first', () => {
      // Expected: the call is rejected, exactly like
      // `startsWith("cat" as "cat" | "dog", "bird")` is (see "reject disjoint
      // prefixes"); nothing that satisfies the constraint can start with
      // "bird".
      //
      // Actual: it compiles. `IsDisjointPrefix` short-circuits to `false`
      // while `T` is an unresolved type parameter so that wrappers over a
      // plain `string` keep compiling, and that also waves through a prefix
      // that is dead for a narrower constraint. TypeScript itself does know
      // the check is dead: it narrows `data` to `never` in the truthy branch,
      // which is why the result collapses to `undefined`.
      const startsWithBird = <T extends 'cat' | 'dog'>(data: T) =>
        startsWith(data, 'bird') ? data : undefined;

      expectTypeOf(startsWithBird('cat')).toEqualTypeOf<undefined>();
    });

    it('data-last', () => {
      // Expected: the call is rejected, exactly like it is on a concrete
      // `("cat" | "dog")[]` (see "reject disjoint prefixes" > "data-last").
      //
      // Actual: it compiles. The rejection overload infers `T` from the
      // wrapper's type parameter, hits the same short-circuit, and never
      // matches; the narrowing overload then filters everything out.
      const startsWithBirdAll = <T extends 'cat' | 'dog'>(data: ReadonlyArray<T>) =>
        filter(data, startsWith('bird'));

      expectTypeOf(startsWithBirdAll(['cat'])).toEqualTypeOf<[]>();
    });
  });

  describe('guaranteed prefixes aren\'t typed `true` through a type parameter', () => {
    it('data-first', () => {
      // `IsGuaranteedPrefix` stays deferred while `T` is an unresolved type
      // parameter, and TypeScript only proves a deferred conditional by
      // instantiating it with the type parameter stripped of its constraint,
      // which no prefix is guaranteed for; the narrowing guard is picked
      // instead.
      const hasFooPrefix = <T extends `foo${string}`>(data: T) =>
        startsWith(data, 'foo');
      const isPrefixed = hasFooPrefix('foobar');

      expectTypeOf(isPrefixed).toEqualTypeOf<boolean>();
      // Everything that satisfies the constraint starts with "foo".
      expectTypeOf(isPrefixed).not.toEqualTypeOf<true>();
    });

    it('data-last', () => {
      // The `true` overload infers `T` from the wrapper's type parameter, hits
      // the same deferral, and never matches; the narrowing guard is picked
      // instead.
      const startsWithFooAll = <T extends `foo${string}`>(data: ReadonlyArray<T>) =>
        map(data, startsWith('foo'));
      const result = startsWithFooAll(['foobar']);

      expectTypeOf(result).items.toEqualTypeOf<boolean>();
      // Everything that satisfies the constraint starts with "foo".
      expectTypeOf(result).items.not.toEqualTypeOf<true>();
    });
  });

  describe('template literals with an impossible prefix aren\'t rejected', () => {
    it('data-first', () => {
      const data = 'foo_1' as `foo_${number}`;

      // If template literals worked the same as literals and union literals
      // this call itself would be rejected.
      const isStartsWith = startsWith(data, 'hello');

      if (isStartsWith) {
        // Rejecting an impossible prefix relies on TypeScript reducing the
        // intersection with the prefix template to `never`. It only does that
        // for bounded types; an intersection of two unbounded template
        // literals is left as-is even when they are disjoint, so the check is
        // accepted and the `true` branch is typed with an uninhabitable
        // intersection instead.
        // @see https://github.com/microsoft/TypeScript/issues/60446
        expectTypeOf(data).toEqualTypeOf<`foo_${number}` & `hello${string}`>();

        // No strings satisfy this type, so it should be equivalent to `never`.
        expectTypeOf(data).not.toEqualTypeOf<never>();
      } else {
        expectTypeOf(data).toEqualTypeOf<`foo_${number}`>();
      }
    });

    it('data-last', () => {
      // Once the intersection in `yes` correctly reduces to `never` this call
      // itself would be rejected.
      const [yes, no] = partition([] as Array<`foo_${number}`>, startsWith('hello'));

      expectTypeOf(yes).toEqualTypeOf<Array<`foo_${number}` & `hello${string}`>>();
      expectTypeOf(no).toEqualTypeOf<Array<`foo_${number}`>>();
    });
  });

  describe('consumers that don\'t reject a dead-code check', () => {
    it('isNot', () => {
      // `isNot` resolves `startsWith` without a concrete data type, since its
      // predicate slot is typed against `isNot`'s own unfixed type parameter;
      // `startsWith`'s `T` is never inferred, so the rejection overload, which
      // needs `T` to find the prefix dead, doesn't match and the generic
      // guard is returned instead. `filter` instantiates that guard with
      // `"cat" | "dog"` only afterwards, past the check. If the rejection
      // ever fired here, the call itself would fail to compile.
      const result = filter([] as Array<'cat' | 'dog'>, isNot(startsWith('bird')));

      expectTypeOf(result).toEqualTypeOf<Array<'cat' | 'dog'>>();
    });
  });

  describe('isNot bypasses the unsound-narrowing guard', () => {
    it('union prefix where only some members are disjoint', () => {
      // For a direct call, an unsound union prefix falls through to the
      // plain-`boolean` overload and `partition` doesn't narrow at all (see
      // "doesn't narrow when only some prefixes are disjoint" above). `isNot`
      // resolves `startsWith` without a concrete data type though (see
      // "consumers that don't reject a dead-code check"), so the soundness
      // check has no `T` to compare against, the `boolean` overload built to
      // reject this case doesn't match, and the generic guard is returned.
      // The result narrows to `"dog"[]`, which is unsound: at runtime the
      // prefix could be `"bird"`, in which case nothing starts with it,
      // `isNot` is `true` for every element, and `"cat"` survives the filter
      // too.
      const result = filter(
        [] as Array<'cat' | 'dog'>,
        isNot(startsWith('c' as 'c' | 'bird')),
      );

      expectTypeOf(result).toEqualTypeOf<Array<'dog'>>();
      // If `isNot` ever resolved this through the sound `boolean` overload,
      // it wouldn't narrow at all, matching the direct-call behavior above.
      expectTypeOf(result).not.toEqualTypeOf<Array<'cat' | 'dog'>>();
    });
  });
});
