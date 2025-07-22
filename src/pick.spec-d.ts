import type { EmptyObject } from 'type-fest';
import { describe, expectTypeOf, it } from 'vitest';
import { keys } from './keys';
import { pick } from './pick';

describe('bounded object types', () => {
  const DATA = { a: 'required', c: undefined } as {
    a: 'required';
    b?: 'optional';
    c: 'undefinable' | undefined;
    d?: 'optional-undefinable' | undefined;
  };

  it('enforces keys must exist on object', () => {
    // @ts-expect-error [ts2322] -- should not allow non existing props
    pick(DATA, ['not', 'in']);
  });

  it('doesn\'t widen key types', () => {
    // @ts-expect-error [ts2345] -- string is too wide for object
    pick(DATA, ['a'] as [string]);
  });

  it('empty keys tuple', () => {
    expectTypeOf(pick(DATA, [])).toEqualTypeOf<EmptyObject>();
  });

  describe('fixed tuple of literal keys', () => {
    it('required key only', () => {
      expectTypeOf(pick(DATA, ['a'])).toEqualTypeOf<{
        a: 'required';
      }>();
    });

    it('optional key only', () => {
      expectTypeOf(pick(DATA, ['b'])).toEqualTypeOf<{
        b?: 'optional';
      }>();
    });

    it('undefinable key only', () => {
      expectTypeOf(pick(DATA, ['c'])).toEqualTypeOf<{
        c: 'undefinable' | undefined;
      }>();
    });

    it('optional-undefinable key only', () => {
      expectTypeOf(pick(DATA, ['d'])).toEqualTypeOf<{
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('required and optional keys', () => {
      expectTypeOf(pick(DATA, ['a', 'b'])).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
      }>();
    });

    it('required and undefinable keys', () => {
      expectTypeOf(pick(DATA, ['a', 'c'])).toEqualTypeOf<{
        a: 'required';
        c: 'undefinable' | undefined;
      }>();
    });

    it('required and optional-undefinable keys', () => {
      expectTypeOf(pick(DATA, ['a', 'd'])).toEqualTypeOf<{
        a: 'required';
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('optional and undefinable keys', () => {
      expectTypeOf(pick(DATA, ['b', 'c'])).toEqualTypeOf<{
        b?: 'optional';
        c: 'undefinable' | undefined;
      }>();
    });

    it('optional and optional-undefinable keys', () => {
      expectTypeOf(pick(DATA, ['b', 'd'])).toEqualTypeOf<{
        b?: 'optional';
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('undefinable and optional-undefinable keys', () => {
      expectTypeOf(pick(DATA, ['c', 'd'])).toEqualTypeOf<{
        c: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('all except optional-undefinable', () => {
      expectTypeOf(pick(DATA, ['a', 'b', 'c'])).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
        c: 'undefinable' | undefined;
      }>();
    });

    it('all except undefinable', () => {
      expectTypeOf(pick(DATA, ['a', 'b', 'd'])).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('all except optional', () => {
      expectTypeOf(pick(DATA, ['a', 'c', 'd'])).toEqualTypeOf<{
        a: 'required';
        c: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('all except required', () => {
      expectTypeOf(pick(DATA, ['b', 'c', 'd'])).toEqualTypeOf<{
        b?: 'optional';
        c: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('all keys', () => {
      expectTypeOf(pick(DATA, ['a', 'b', 'c', 'd'])).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
        c: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });
  });

  describe('single union key', () => {
    it('required or optional', () => {
      expectTypeOf(pick(DATA, ['a' as 'a' | 'b'])).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
    });

    it('required or undefinable', () => {
      expectTypeOf(pick(DATA, ['a' as 'a' | 'c'])).toEqualTypeOf<{
        a?: 'required';
        c?: 'undefinable' | undefined;
      }>();
    });

    it('required or optional-undefinable', () => {
      expectTypeOf(pick(DATA, ['a' as 'a' | 'd'])).toEqualTypeOf<{
        a?: 'required';
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('optional or undefinable', () => {
      expectTypeOf(pick(DATA, ['b' as 'b' | 'c'])).toEqualTypeOf<{
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
    });

    it('optional or optional-undefinable', () => {
      expectTypeOf(pick(DATA, ['b' as 'b' | 'd'])).toEqualTypeOf<{
        b?: 'optional';
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('undefinable or optional-undefinable', () => {
      expectTypeOf(pick(DATA, ['c' as 'c' | 'd'])).toEqualTypeOf<{
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('required, optional, and undefinable', () => {
      expectTypeOf(pick(DATA, ['a' as 'a' | 'b' | 'c'])).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
    });

    it('required, optional, and optional-undefinable', () => {
      expectTypeOf(pick(DATA, ['a' as 'a' | 'b' | 'd'])).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('required, undefinable, and optional-undefinable', () => {
      expectTypeOf(pick(DATA, ['a' as 'a' | 'c' | 'd'])).toEqualTypeOf<{
        a?: 'required';
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('optional, undefinable, and optional-undefinable', () => {
      expectTypeOf(pick(DATA, ['b' as 'b' | 'c' | 'd'])).toEqualTypeOf<{
        b?: 'optional';
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('all key types', () => {
      expectTypeOf(pick(DATA, ['a' as 'a' | 'b' | 'c' | 'd'])).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });
  });

  describe('multiple union keys', () => {
    it('with partial overlap', () => {
      expectTypeOf(
        pick(DATA, ['a' as 'a' | 'b', 'b' as 'b' | 'c']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
    });

    it('with full overlap', () => {
      expectTypeOf(
        pick(DATA, ['a' as 'a' | 'b', 'b' as 'a' | 'b']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
    });

    it('without overlap', () => {
      expectTypeOf(
        pick(DATA, ['a' as 'a' | 'b', 'c' as 'c' | 'd']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });
  });

  describe('mixed literal and union keys', () => {
    it('with partial overlap', () => {
      expectTypeOf(pick(DATA, ['a', 'b' as 'a' | 'b'])).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
      }>();
    });

    it('without overlap', () => {
      expectTypeOf(pick(DATA, ['a', 'b' as 'b' | 'c'])).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
    });
  });

  describe('array with literal key', () => {
    it('required key', () => {
      expectTypeOf(pick(DATA, [] as Array<'a'>)).toEqualTypeOf<{
        a?: 'required';
      }>();
    });

    it('optional key', () => {
      expectTypeOf(pick(DATA, [] as Array<'b'>)).toEqualTypeOf<{
        b?: 'optional';
      }>();
    });

    it('undefinable key', () => {
      expectTypeOf(pick(DATA, [] as Array<'c'>)).toEqualTypeOf<{
        c?: 'undefinable' | undefined;
      }>();
    });

    it('optional-undefinable key', () => {
      expectTypeOf(pick(DATA, [] as Array<'d'>)).toEqualTypeOf<{
        d?: 'optional-undefinable' | undefined;
      }>();
    });
  });

  describe('array with union keys', () => {
    it('required or optional', () => {
      expectTypeOf(pick(DATA, [] as Array<'a' | 'b'>)).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
    });

    it('required or undefinable picked', () => {
      expectTypeOf(pick(DATA, [] as Array<'a' | 'c'>)).toEqualTypeOf<{
        a?: 'required';
        c?: 'undefinable' | undefined;
      }>();
    });

    it('required or optional-undefinable picked', () => {
      expectTypeOf(pick(DATA, [] as Array<'a' | 'd'>)).toEqualTypeOf<{
        a?: 'required';
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('optional or undefinable picked', () => {
      expectTypeOf(pick(DATA, [] as Array<'b' | 'c'>)).toEqualTypeOf<{
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
    });

    it('optional or optional-undefinable picked', () => {
      expectTypeOf(pick(DATA, [] as Array<'b' | 'd'>)).toEqualTypeOf<{
        b?: 'optional';
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('undefinable or optional-undefinable picked', () => {
      expectTypeOf(pick(DATA, [] as Array<'c' | 'd'>)).toEqualTypeOf<{
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('required, optional or undefinable picked', () => {
      expectTypeOf(pick(DATA, [] as Array<'a' | 'b' | 'c'>)).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
    });

    it('required, optional or optional-undefinable picked', () => {
      expectTypeOf(pick(DATA, [] as Array<'a' | 'b' | 'd'>)).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('required, undefinable or optional-undefinable picked', () => {
      expectTypeOf(pick(DATA, [] as Array<'a' | 'c' | 'd'>)).toEqualTypeOf<{
        a?: 'required';
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('optional, undefinable or optional-undefinable picked', () => {
      expectTypeOf(pick(DATA, [] as Array<'b' | 'c' | 'd'>)).toEqualTypeOf<{
        b?: 'optional';
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });

    it('all keys', () => {
      expectTypeOf(
        pick(DATA, [] as Array<'a' | 'b' | 'c' | 'd'>),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });
  });

  describe('non-empty (prefix) arrays', () => {
    it('all literals, with overlap', () => {
      expectTypeOf(pick(DATA, ['a'] as ['a', ...Array<'a'>])).toEqualTypeOf<{
        a: 'required';
      }>();
    });

    it('all literals, no overlap', () => {
      expectTypeOf(pick(DATA, ['a'] as ['a', ...Array<'b'>])).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
      }>();
      expectTypeOf(pick(DATA, ['b'] as ['b', ...Array<'a'>])).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
    });

    it('with unions, partial overlap', () => {
      expectTypeOf(
        pick(DATA, ['a'] as ['a', ...Array<'a' | 'b'>]),
      ).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
      }>();
      expectTypeOf(
        pick(DATA, ['b'] as ['b', ...Array<'a' | 'b'>]),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
      expectTypeOf(
        pick(DATA, ['a'] as ['a' | 'b', ...Array<'a'>]),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
      expectTypeOf(
        pick(DATA, ['a'] as ['a' | 'b', ...Array<'b'>]),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
      expectTypeOf(
        pick(DATA, ['a'] as ['a' | 'b', ...Array<'b' | 'c'>]),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
    });

    it('with unions, full overlap', () => {
      expectTypeOf(
        pick(DATA, ['a'] as ['a' | 'b', ...Array<'a' | 'b'>]),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
    });

    it('with unions, no overlap', () => {
      expectTypeOf(
        pick(DATA, ['a'] as ['a', ...Array<'b' | 'c'>]),
      ).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ['b'] as ['b', ...Array<'a' | 'c'>]),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ['a'] as ['a' | 'b', ...Array<'c'>]),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ['b'] as ['b' | 'c', ...Array<'a'>]),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ['a'] as ['a' | 'b', ...Array<'c' | 'd'>]),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });
  });

  describe('non-empty (suffix) arrays', () => {
    it('all literals, with overlap', () => {
      expectTypeOf(pick(DATA, ['a'] as [...Array<'a'>, 'a'])).toEqualTypeOf<{
        a: 'required';
      }>();
    });

    it('all literals, no overlap', () => {
      expectTypeOf(pick(DATA, ['a'] as [...Array<'b'>, 'a'])).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
      }>();
      expectTypeOf(pick(DATA, ['b'] as [...Array<'a'>, 'b'])).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
    });

    it('with unions, partial overlap', () => {
      expectTypeOf(
        pick(DATA, ['a'] as [...Array<'a' | 'b'>, 'a']),
      ).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
      }>();
      expectTypeOf(
        pick(DATA, ['b'] as [...Array<'a' | 'b'>, 'b']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
      expectTypeOf(
        pick(DATA, ['a'] as [...Array<'a'>, 'a' | 'b']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
      expectTypeOf(
        pick(DATA, ['a'] as [...Array<'b'>, 'a' | 'b']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
      expectTypeOf(
        pick(DATA, ['a'] as [...Array<'b' | 'c'>, 'a' | 'b']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
    });

    it('with unions, full overlap', () => {
      expectTypeOf(
        pick(DATA, ['a'] as [...Array<'a' | 'b'>, 'a' | 'b']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
      }>();
    });

    it('with unions, no overlap', () => {
      expectTypeOf(
        pick(DATA, ['a'] as [...Array<'b' | 'c'>, 'a']),
      ).toEqualTypeOf<{
        a: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ['b'] as [...Array<'a' | 'c'>, 'b']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ['a'] as [...Array<'c'>, 'a' | 'b']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ['b'] as [...Array<'a'>, 'b' | 'c']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ['a'] as [...Array<'c' | 'd'>, 'a' | 'b']),
      ).toEqualTypeOf<{
        a?: 'required';
        b?: 'optional';
        c?: 'undefinable' | undefined;
        d?: 'optional-undefinable' | undefined;
      }>();
    });
  });
});

// @see https://github.com/remeda/remeda/issues/1128
describe('unbounded record types (Issue #1128)', () => {
  const DATA = {} as Record<string, 'required'>;
  const UNDEFINABLE = {} as Record<string, 'undefinable' | undefined>;

  it('enforces keys must exist on object', () => {
    // @ts-expect-error [ts2322] -- should not allow non existing props
    pick(DATA, [1, 2]);
  });

  it('doesn\'t widen key types', () => {
    // @ts-expect-error [ts2345] -- string is too wide for object
    pick(DATA, ['a'] as [PropertyKey]);
  });

  it('empty keys tuple', () => {
    expectTypeOf(pick(DATA, [])).toEqualTypeOf<EmptyObject>();
  });

  describe('fixed tuple keys', () => {
    it('literal keys', () => {
      const picks = ['a', 'b'] as const;

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
      }>();
    });

    it('non-overlapping union keys', () => {
      const picks = ['a', 'c'] as ['a' | 'b', 'c' | 'd'];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
        c?: 'required';
        d?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
        c?: 'undefinable' | undefined;
        d?: 'undefinable' | undefined;
      }>();
    });

    it('partially overlapping union keys', () => {
      const picks = ['a', 'b'] as ['a' | 'b', 'b' | 'c'];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
        c?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
        c?: 'undefinable' | undefined;
      }>();
    });

    it('fully overlapping union keys', () => {
      const picks = ['a', 'b'] as ['a' | 'b', 'a' | 'b'];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
      }>();
    });

    it('literal and overlapping union keys', () => {
      const picks = ['a', 'b'] as ['a', 'a' | 'b'];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
      }>();
    });

    it('literal and non-overlapping union keys', () => {
      const picks = ['a', 'b'] as ['a', 'b' | 'c'];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
        c?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
        c?: 'undefinable' | undefined;
      }>();
    });

    it('primitive keys', () => {
      const picks = ['a', 'b'] as [string, string];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, 'required'>
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, 'undefinable' | undefined>
      >();
    });

    it('primitive and singular literal keys', () => {
      const picks = ['a', 'b'] as ['a', string];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, 'required'>
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, 'undefinable' | undefined>
      >();
    });

    it('primitive and union of literal', () => {
      const picks = ['a', 'b'] as ['a' | 'b', string];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, 'required'>
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, 'undefinable' | undefined>
      >();
    });
  });

  describe('array keys', () => {
    it('literal key', () => {
      const picks = [] as Array<'a'>;

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
      }>();
    });

    it('union keys', () => {
      const picks = [] as Array<'a' | 'b'>;

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
      }>();
    });

    it('primitive keys', () => {
      const picks = [] as Array<string>;

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, 'required'>
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, 'undefinable' | undefined>
      >();
    });
  });

  describe('prefix array keys', () => {
    it('non-overlapping literal keys', () => {
      const picks = ['a'] as ['a', ...Array<'b'>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
      }>();
    });

    it('overlapping literal keys', () => {
      const picks = ['a'] as ['a', ...Array<'a'>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
      }>();
    });

    it('union of non-overlapping literals', () => {
      const picks = ['a'] as ['a' | 'b', ...Array<'c' | 'd'>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
        c?: 'required';
        d?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
        c?: 'undefinable' | undefined;
        d?: 'undefinable' | undefined;
      }>();
    });

    it('union of partially overlapping literals', () => {
      const picks = ['a'] as ['a' | 'b', ...Array<'b' | 'c'>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
        c?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
        c?: 'undefinable' | undefined;
      }>();
    });

    it('union of fully overlapping literals', () => {
      const picks = ['a'] as ['a' | 'b', ...Array<'a' | 'b'>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
      }>();
    });

    it('literals and overlapping union of literals', () => {
      const picks = ['a'] as ['a', ...Array<'a' | 'b'>];
      const alt = ['a'] as ['a' | 'b', ...Array<'b'>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
      }>();
      expectTypeOf(pick(DATA, alt)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, alt)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
      }>();
    });

    it('literals and non-overlapping union of literals', () => {
      const picks = ['a'] as ['a', ...Array<'b' | 'c'>];
      const alt = ['a'] as ['a' | 'b', ...Array<'c'>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
        c?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
        c?: 'undefinable' | undefined;
      }>();
      expectTypeOf(pick(DATA, alt)).toEqualTypeOf<{
        a?: 'required';
        b?: 'required';
        c?: 'required';
      }>();
      expectTypeOf(pick(UNDEFINABLE, alt)).toEqualTypeOf<{
        a?: 'undefinable' | undefined;
        b?: 'undefinable' | undefined;
        c?: 'undefinable' | undefined;
      }>();
    });

    it('primitive keys', () => {
      const picks = ['a'] as [string, ...Array<string>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, 'required'>
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, 'undefinable' | undefined>
      >();
    });

    it('primitive and singular literal keys', () => {
      const picks = ['a'] as ['a', ...Array<string>];
      const alt = ['a'] as [string, ...Array<'a'>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, 'required'>
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, 'undefinable' | undefined>
      >();
      expectTypeOf(pick(DATA, alt)).toEqualTypeOf<Record<string, 'required'>>();
      expectTypeOf(pick(UNDEFINABLE, alt)).toEqualTypeOf<
        Record<string, 'undefinable' | undefined>
      >();
    });

    it('primitive and union of literal', () => {
      const picks = ['a'] as ['a' | 'b', ...Array<string>];
      const alt = ['a'] as [string, ...Array<'a' | 'b'>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, 'required'>
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, 'undefinable' | undefined>
      >();
      expectTypeOf(pick(DATA, alt)).toEqualTypeOf<Record<string, 'required'>>();
      expectTypeOf(pick(UNDEFINABLE, alt)).toEqualTypeOf<
        Record<string, 'undefinable' | undefined>
      >();
    });
  });

  it('narrows on unbounded keys but doesn\'t make it partial', () => {
    const picks = [] as Array<`prefix_${string}`>;

    expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
      Record<`prefix_${string}`, 'required'>
    >();
    expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
      Record<`prefix_${string}`, 'undefinable' | undefined>
    >();
  });
});

describe('union object types', () => {
  describe('keys exist in all union members', () => {
    it('same type', () => {
      expectTypeOf(
        pick(
          { a: 'a', b: 'b', c: 'c' } as
          | { a: 'a'; b: 'b'; c: 'c' }
          | { a: 'a'; b: 'b'; d: 'd' },
          ['a', 'b'],
        ),
      ).toEqualTypeOf<{ a: 'a'; b: 'b' }>();
    });

    it('different optionality', () => {
      expectTypeOf(
        pick(
          { a: 'a', b: 'b', c: 'c' } as
          | { a: 'a'; b: 'b'; c: 'c' }
          | { a?: 'a'; b: 'b'; d: 'd' },
          ['a', 'b'],
        ),
      ).toEqualTypeOf<{ a: 'a'; b: 'b' } | { a?: 'a'; b: 'b' }>();
    });

    it('different types', () => {
      expectTypeOf(
        pick(
          { a: 'a', b: 'b', c: 'c' } as
          | { a: 'a'; b: 'b'; c: 'c' }
          | { a: 'alt_a'; b: 'alt_b'; d: 'd' },
          ['a', 'b'],
        ),
      ).toEqualTypeOf<{ a: 'a'; b: 'b' } | { a: 'alt_a'; b: 'alt_b' }>();
    });
  });

  describe('keys exist in some union members', () => {
    it('same type', () => {
      const DATA = { a: 'a', b: 'b', c: 'c' } as
        | { a: 'a'; b: 'b'; c: 'c' }
        | { a: 'a'; b: 'b'; d: 'd' };

      expectTypeOf(pick(DATA, ['a', 'c'])).toEqualTypeOf<
        { a: 'a'; c: 'c' } | { a: 'a' }
      >();
      expectTypeOf(pick(DATA, ['a', 'd'])).toEqualTypeOf<
        { a: 'a' } | { a: 'a'; d: 'd' }
      >();
    });

    it('different optionality', () => {
      const DATA = { a: 'a', b: 'b', c: 'c' } as
        | { a: 'a'; b: 'b'; c: 'c' }
        | { a?: 'a'; b: 'b'; d: 'd' };

      expectTypeOf(pick(DATA, ['a', 'c'])).toEqualTypeOf<
        { a: 'a'; c: 'c' } | { a?: 'a' }
      >();
      expectTypeOf(pick(DATA, ['a', 'd'])).toEqualTypeOf<
        { a: 'a' } | { a?: 'a'; d: 'd' }
      >();
    });

    it('different types', () => {
      const DATA = { a: 'a', b: 'b', c: 'c' } as
        | { a: 'a'; b: 'b'; c: 'c' }
        | { a: 'alt_a'; b: 'alt_b'; d: 'alt_d' };

      expectTypeOf(pick(DATA, ['a', 'c'])).toEqualTypeOf<
        { a: 'a'; c: 'c' } | { a: 'alt_a' }
      >();
      expectTypeOf(pick(DATA, ['a', 'd'])).toEqualTypeOf<
        { a: 'a' } | { a: 'alt_a'; d: 'alt_d' }
      >();
    });
  });

  it('keys belong to single union member', () => {
    expectTypeOf(
      pick(
        { a: 'a', b: 'b', c: 'c' } as
        | { a: 'a'; b: 'b'; c: 'c' }
        | { d: 'd'; e: 'e'; f: 'f' },
        ['a', 'b'],
      ),
    ).toEqualTypeOf<{ a: 'a'; b: 'b' } | EmptyObject>();
  });

  it('keys distributed across union members', () => {
    expectTypeOf(
      pick({ a: 'a', b: 'b' } as { a: 'a'; b: 'b' } | { c: 'c'; d: 'd' }, [
        'a',
        'd',
      ]),
    ).toEqualTypeOf<{ a: 'a' } | { d: 'd' }>();
  });
});

describe('union key array types', () => {
  describe('disjoint literal keys', () => {
    it('bounded plain object', () => {
      expectTypeOf(
        pick({ a: 'a', b: 'b' }, ['a'] as ['a'] | ['b']),
      ).toEqualTypeOf<{ a: string } | { b: string }>();
    });

    it('unbounded record', () => {
      expectTypeOf(
        pick({} as Record<string, 'value'>, ['a'] as ['a'] | ['b']),
      ).toEqualTypeOf<{ a?: 'value' } | { b?: 'value' }>();
    });
  });

  describe('overlapping literal keys', () => {
    const picks = ['a', 'b'] as ['a', 'b'] | ['b', 'c'];

    it('bounded plain object', () => {
      expectTypeOf(pick({ a: 'a', b: 'b', c: 'c' }, picks)).toEqualTypeOf<
        { a: string; b: string } | { b: string; c: string }
      >();
    });

    it('unbounded record', () => {
      expectTypeOf(pick({} as Record<string, 'value'>, picks)).toEqualTypeOf<
        { a?: 'value'; b?: 'value' } | { b?: 'value'; c?: 'value' }
      >();
    });
  });

  describe('overlapping union keys', () => {
    const picks = ['a', 'b'] as ['a' | 'b', 'b' | 'c'] | ['b' | 'c', 'c' | 'd'];

    it('bounded plain object', () => {
      expectTypeOf(
        pick({ a: 'a', b: 'b', c: 'c', d: 'd' }, picks),
      ).toEqualTypeOf<
        | { a?: string; b?: string; c?: string }
        | { b?: string; c?: string; d?: string }
      >();
    });

    it('unbounded record', () => {
      expectTypeOf(pick({} as Record<string, 'value'>, picks)).toEqualTypeOf<
        | { a?: 'value'; b?: 'value'; c?: 'value' }
        | { b?: 'value'; c?: 'value'; d?: 'value' }
      >();
    });
  });

  describe('different array shapes', () => {
    const picks = ['a', 'b'] as ['a' | 'b', 'b' | 'c'] | Array<'d'>;

    it('bounded plain object', () => {
      expectTypeOf(
        pick({ a: 'a', b: 'b', c: 'c', d: 'd' }, picks),
      ).toEqualTypeOf<
        { a?: string; b?: string; c?: string } | { d?: string }
      >();
    });

    it('unbounded record', () => {
      expectTypeOf(pick({} as Record<string, 'value'>, picks)).toEqualTypeOf<
        { a?: 'value'; b?: 'value'; c?: 'value' } | { d?: 'value' }
      >();
    });
  });

  it('mix of literals and primitives', () => {
    expectTypeOf(
      pick({} as Record<string, 'value'>, [] as Array<string> | Array<'a'>),
    ).toEqualTypeOf<Record<string, 'value'> | { a?: 'value' }>();
  });
});

it('result is mutable', () => {
  expectTypeOf(pick({ a: 1 } as const, ['a'])).toEqualTypeOf<{
    a: 1;
  }>();

  expectTypeOf(
    pick({} as Readonly<Record<string, 'something'>>, [] as Array<string>),
  ).toEqualTypeOf<Record<string, 'something'>>();
});

// @see https://github.com/remeda/remeda/issues/886
describe('key type inference (issue #886)', () => {
  it('base', () => {
    expectTypeOf(pick({ foo: 'hello', bar: 'world' }, ['foo'])).toEqualTypeOf<{
      foo: string;
    }>();
  });

  it('wrapped', () => {
    expectTypeOf(
      keys(pick({ foo: 'hello', bar: 'world' }, ['foo'])),
    ).toEqualTypeOf<Array<'foo'>>();
  });

  it('with const key', () => {
    expectTypeOf(
      keys(pick({ foo: 'hello', bar: 'world' }, ['foo'] as const)),
    ).toEqualTypeOf<Array<'foo'>>();
  });
});

it('supports inherited properties', () => {
  class BaseClass {
    public testProp(): string {
      return 'abc';
    }
  }
  class TestClass extends BaseClass {}

  expectTypeOf(pick(new TestClass(), ['testProp'])).toEqualTypeOf<{
    testProp: () => string;
  }>();
});
