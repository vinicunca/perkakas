/* eslint-disable sonar/no-all-duplicated-branches */
import type { Tagged } from 'type-fest';
import { describe, expectTypeOf, it } from 'vitest';
import { isEmptyish } from './is-emptyish';

declare const SYMBOL: unique symbol;

// eslint-disable-next-line ts/no-unused-vars -- This is a trick in order to bypass breaking changes introduced in TypeScript that made TypedArrays like `Int8Array` accept a required type parameter.
const TYPED_ARRAY = new Int8Array(1);
export type TypedArray = typeof TYPED_ARRAY;

// eslint-disable-next-line ts/no-unused-vars, node/prefer-global/buffer -- This is a trick in order to bypass breaking changes introduced in TypeScript that made `Buffer` accept a required type parameter.
const BUFFER = Buffer.alloc(0);
export type Buffer = typeof BUFFER;

describe('strings', () => {
  it('primitives', () => {
    const data = 'test' as string;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  it('empty literal', () => {
    const data = '' as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('non-empty literals', () => {
    const data = 'test' as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'test'>();
    }
  });

  it('union of non-empty literals', () => {
    const data = 'cat' as 'cat' | 'dog';
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'cat' | 'dog'>();
    }
  });

  it('union with an empty literal', () => {
    const data = '' as '' | 'cat' | 'dog';
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'cat' | 'dog'>();
    }
  });

  it('non-empty string templates', () => {
    const data = 'prefix_0' as `prefix_${number}`;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`prefix_${number}`>();
    }
  });

  it('string template (with empty)', () => {
    const data = '' as '' | `prefix_${number}`;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    } else {
      expectTypeOf(data).toEqualTypeOf<`prefix_${number}`>();
    }
  });

  it('empty-able string template', () => {
    const data = '' as `${'' | 'cat'}${'' | 'dog'}`;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'cat' | 'dog' | 'catdog'>();
    }
  });
});

describe('branded', () => {
  it('primitive', () => {
    const data = '' as Tagged<string, 'brand'>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Tagged<'', 'brand'>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Tagged<string, 'brand'>>();
    }
  });

  it('non-empty literal', () => {
    const data = 'test' as Tagged<'test', 'brand'>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Tagged<'test', 'brand'>>();
    }
  });

  it('empty literal', () => {
    const data = '' as Tagged<'', 'brand'>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Tagged<'', 'brand'>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('union of non-empty literals', () => {
    const data = 'cat' as Tagged<'cat' | 'dog', 'brand'>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Tagged<'cat' | 'dog', 'brand'>>();
    }
  });

  it('union of empty and non-empty literals', () => {
    const data = '' as Tagged<'test' | '', 'brand'>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Tagged<'', 'brand'>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Tagged<'test', 'brand'>>();
    }
  });
});

describe('nullish', () => {
  it('null', () => {
    const data = null;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<null>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('undefined', () => {
    const data = undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('optional nullable', () => {
    const data = null as null | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<null | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('optional primitive', () => {
    const data = undefined as string | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  it('optional non-empty literal', () => {
    const data = 'cat' as 'cat' | 'dog' | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'cat' | 'dog'>();
    }
  });

  it('optional empty literal', () => {
    const data = '' as '' | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('nullable primitive', () => {
    const data = null as string | null;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | null>();
    } else {
      expectTypeOf(data).toEqualTypeOf<string>();
    }
  });

  it('nullable non-empty literal', () => {
    const data = 'cat' as 'cat' | null;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<null>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'cat'>();
    }
  });

  it('nullable empty literal', () => {
    const data = '' as '' | null;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | null>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('optional, nullable, empty, and non-empty', () => {
    const data = '' as '' | 'cat' | null | undefined;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | null | undefined>();
    } else {
      expectTypeOf(data).toEqualTypeOf<'cat'>();
    }
  });
});

describe('all tuple shapes', () => {
  // See TupleParts for a description of all possible tuple shapes.

  it('empty tuple', () => {
    const data = [] as [];
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<[]>();
    } else {
      // Can never be non-empty
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('empty readonly tuple', () => {
    const data = [] as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<readonly []>();
    } else {
      // Can never be non-empty
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('fixed tuple', () => {
    const data = [1, 2, 3] as [number, number, number];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number, number, number]>();
    }
  });

  it('fixed readonly tuple', () => {
    const data = [1, 2, 3] as const;
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();
    }
  });

  it('array', () => {
    const data = [] as Array<'cat'>;
    if (isEmptyish(data)) {
      // No narrowing when the array is mutable so that it remains mutable
      // (effectively turning off the "type-predicate"-ness of the function)
      expectTypeOf(data).toExtend<Array<'cat'>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Array<'cat'>>();
    }
  });

  it('readonly array', () => {
    const data = [] as ReadonlyArray<'cat'>;
    if (isEmptyish(data)) {
      // When the array is not mutable we can narrow it down because it can't
      // change.
      expectTypeOf(data).toEqualTypeOf<readonly []>();
    } else {
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<'cat'>>();
    }
  });

  it('optional tuple', () => {
    const data = [] as [number?, number?, string?];
    if (isEmptyish(data)) {
      // No narrowing when the array is mutable so that it remains mutable
      // (effectively turning off the "type-predicate"-ness of the function)
      expectTypeOf(data).toExtend<[number?, number?, string?]>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number?, number?, string?]>();
    }
  });

  it('readonly optional tuple', () => {
    const data = [] as readonly [number?, number?, string?];
    if (isEmptyish(data)) {
      // When the array is not mutable we can narrow it down because it can't
      // change.
      expectTypeOf(data).toEqualTypeOf<readonly []>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [number?, number?, string?]>();
    }
  });

  it('fixed-prefix array', () => {
    const data = [1] as [number, ...Array<number>];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number, ...Array<number>]>();
    }
  });

  it('readonly fixed-prefix array', () => {
    const data = [1] as readonly [number, ...Array<number>];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [number, ...Array<number>]>();
    }
  });

  it('fixed-suffix array', () => {
    const data = [1] as [...Array<number>, number];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[...Array<number>, number]>();
    }
  });

  it('readonly fixed-suffix array', () => {
    const data = [1] as readonly [...Array<number>, number];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [...Array<number>, number]>();
    }
  });

  it('mixed tuples', () => {
    const data = [1] as [number, string?];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number, string?]>();
    }
  });

  it('readonly mixed tuples', () => {
    const data = [1] as readonly [number, string?];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [number, string?]>();
    }
  });

  it('optional prefix arrays', () => {
    const data = [] as [number?, ...Array<number>];
    if (isEmptyish(data)) {
      // No narrowing when the array is mutable so that it remains mutable
      // (effectively turning off the "type-predicate"-ness of the function)
      expectTypeOf(data).toExtend<[number?, ...Array<number>]>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number?, ...Array<number>]>();
    }
  });

  it('readonly optional prefix arrays', () => {
    const data = [] as readonly [number?, ...Array<number>];
    if (isEmptyish(data)) {
      // When the array is not mutable we can narrow it down because it can't
      // change.
      expectTypeOf(data).toEqualTypeOf<readonly []>();
    } else {
      expectTypeOf(data).toEqualTypeOf<readonly [number?, ...Array<number>]>();
    }
  });

  it('fixed-elements array', () => {
    const data = [1, 2] as [number, ...Array<number>, number];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<[number, ...Array<number>, number]>();
    }
  });

  it('readonly fixed-elements array', () => {
    const data = [1, 2] as readonly [number, ...Array<number>, number];
    if (isEmptyish(data)) {
      // Can never be empty
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<
        readonly [number, ...Array<number>, number]
      >();
    }
  });
});

describe('array-like', () => {
  it('typed arrays', () => {
    const data = {} as TypedArray;
    if (isEmptyish(data)) {
      // Typed arrays are either mutable via their underlying buffer, or they
      // do not track their length; in both cases we don't have a narrower type
      // to represent the emptiness.

      expectTypeOf(data).toExtend<TypedArray>();
    } else {
      expectTypeOf(data).toEqualTypeOf<TypedArray>();
    }
  });

  it('buffers', () => {
    const data = {} as Buffer;
    if (isEmptyish(data)) {
      // There's no way to construct an empty Buffer at the type level.

      expectTypeOf(data).toExtend<Buffer>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Buffer>();
    }
  });

  it('sets', () => {
    const data = new Set<number>();
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<Set<number>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Set<number>>();
    }
  });

  it('readonly sets', () => {
    const data = new Set<number>() as ReadonlySet<number>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<ReadonlySet<never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<ReadonlySet<number>>();
    }
  });

  it('array-like (e.g., `arguments`)', () => {
    const args = getIArguments();
    if (isEmptyish(args)) {
      expectTypeOf(args).toExtend<IArguments>();
    } else {
      expectTypeOf(args).toEqualTypeOf<IArguments>();
    }
  });
});

describe('plain objects', () => {
  it('never record', () => {
    const data = {} as Record<PropertyKey, never>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Record<PropertyKey, never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('readonly never record', () => {
    const data = {} as Readonly<Record<PropertyKey, never>>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Readonly<Record<PropertyKey, never>>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('plain object', () => {
    const data = { a: 123, b: 'hello' };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a: number; b: string }>();
    }
  });

  it('readonly plain object', () => {
    const data = { a: 123, b: 'hello' } as const;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a: 123;
        readonly b: 'hello';
      }>();
    }
  });

  it('unbounded record', () => {
    const data = {} as Record<string, string>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<Record<string, string>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Record<string, string>>();
    }
  });

  it('readonly unbounded record', () => {
    const data = {} as Readonly<Record<string, string>>;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<Readonly<Record<string, never>>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Readonly<Record<string, string>>>();
    }
  });

  it('partial bounded record', () => {
    const data = {} as { a?: number; b?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<{ a?: number; b?: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a?: number; b?: string }>();
    }
  });

  it('readonly partial bounded record', () => {
    const data = {} as { readonly a?: number; readonly b?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a?: never;
        readonly b?: never;
      }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a?: number;
        readonly b?: string;
      }>();
    }
  });

  it('partial and required props', () => {
    const data = {} as { a: number; b?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a: number; b?: string }>();
    }
  });

  it('required interfaces', () => {
    interface MyInterface {
      a: number;
    }
    const data = {} as MyInterface;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<MyInterface>();
    }
  });

  it('optional interfaces', () => {
    interface MyInterface {
      a?: number;
    }
    const data = {} as MyInterface;
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<MyInterface>();
    } else {
      expectTypeOf(data).toEqualTypeOf<MyInterface>();
    }
  });

  it('optional readonly interfaces', () => {
    interface MyInterface {
      readonly a?: number;
    }
    const data = {} as MyInterface;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly a?: never }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<MyInterface>();
    }
  });

  it('required prop and index signature', () => {
    const data = { a: 'hello' } as { a: string; [key: string]: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a: string; [key: string]: string }>();
    }
  });

  it('readonly required prop and index signature', () => {
    const data = { a: 'hello' } as {
      readonly a: string;
      readonly [key: string]: string;
    };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a: string;
        readonly [key: string]: string;
      }>();
    }
  });

  it('optional prop and index signature', () => {
    const data = {} as { a?: string; [key: string]: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<{ a?: string; [key: string]: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a?: string; [key: string]: string }>();
    }
  });

  it('readonly optional prop and index signature', () => {
    const data = {} as { readonly a?: string; readonly [key: string]: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a?: never;
        readonly [key: string]: never;
      }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{
        readonly a?: string;
        readonly [key: string]: string;
      }>();
    }
  });

  it('required symbol prop', () => {
    const data = { [SYMBOL]: 'world' };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ [SYMBOL]: string }>();
    }
  });

  it('optional symbol prop', () => {
    const data = {} as { [SYMBOL]?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<{ [SYMBOL]?: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ [SYMBOL]?: string }>();
    }
  });

  it('readonly optional symbol prop', () => {
    const data = {} as { readonly [SYMBOL]?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly [SYMBOL]?: never }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ readonly [SYMBOL]?: string }>();
    }
  });
});

describe('keyed collections', () => {
  it('maps', () => {
    const data = new Map<string, number>();
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<Map<string, number>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<Map<string, number>>();
    }
  });

  it('readonly maps', () => {
    const data: ReadonlyMap<string, number> = new Map();
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<ReadonlyMap<string, never>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<ReadonlyMap<string, number>>();
    }
  });

  it('search params', () => {
    const data = new URLSearchParams();
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<URLSearchParams>();
    } else {
      expectTypeOf(data).toEqualTypeOf<URLSearchParams>();
    }
  });
});

describe('self-declared sizes', () => {
  it('primitive length', () => {
    const data = { length: 0, a: 'hello' };
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<{ length: number; a: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ length: number; a: string }>();
    }
  });

  it('literal empty length', () => {
    const data = { length: 0 } as { length: 0; a?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{ length: 0; a?: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('literal non-empty length', () => {
    const data = { length: 1 } as { length: 1; a: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ length: 1; a: string }>();
    }
  });

  it('literal union of empty and non-empty length', () => {
    const data = { length: 1 } as { length: 0 | 1; a: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<{ length: 0 | 1; a: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ length: 0 | 1; a: string }>();
    }
  });

  it('length is optional and readonly', () => {
    const data = {} as { readonly length?: number };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly length?: never }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ readonly length?: number }>();
    }
  });

  it('primitive size', () => {
    const data = { size: 0, a: 'hello' };
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<{ size: number; a: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ size: number; a: string }>();
    }
  });

  it('literal empty size', () => {
    const data = { size: 0 } as { size: 0; a?: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{ size: 0; a?: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('literal non-empty size', () => {
    const data = { size: 1 } as { size: 1; a: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<never>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ size: 1; a: string }>();
    }
  });

  it('literal union of empty and non-empty size', () => {
    const data = { size: 1 } as { size: 0 | 1; a: string };
    if (isEmptyish(data)) {
      expectTypeOf(data).toExtend<{ size: 0 | 1; a: string }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ size: 0 | 1; a: string }>();
    }
  });

  it('size is optional and readonly', () => {
    const data = {} as { readonly size?: number };
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly size?: never }>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ readonly size?: number }>();
    }
  });
});

describe('generic types', () => {
  it('non-nullable', () => {
    const data = {} as const;
    if (isEmptyish(data)) {
      // eslint-disable-next-line ts/no-empty-object-type
      expectTypeOf(data).toEqualTypeOf<{}>();
    } else {
      // eslint-disable-next-line ts/no-empty-object-type
      expectTypeOf(data).toEqualTypeOf<{}>();
    }
  });

  it('any', () => {
    // eslint-disable-next-line ts/no-explicit-any
    const data = '' as any;
    if (isEmptyish(data)) {
      // eslint-disable-next-line ts/no-explicit-any
      expectTypeOf(data).toEqualTypeOf<any>();
    } else {
      // For any type, the else branch should also be any, not narrowed
      // eslint-disable-next-line ts/no-explicit-any
      expectTypeOf(data).toEqualTypeOf<any>();
    }
  });

  it('unknown', () => {
    const data = '' as unknown;
    if (isEmptyish(data)) {
      expectTypeOf(data).toEqualTypeOf<unknown>();
    } else {
      expectTypeOf(data).toEqualTypeOf<unknown>();
    }
  });
});

function getIArguments(): IArguments {
  // eslint-disable-next-line prefer-rest-params -- Intentional! This is the whole purpose of this function!
  return arguments;
}
