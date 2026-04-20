import { describe, expectTypeOf, it } from 'vitest';
import { pipe } from './pipe';
import { toLowerCase } from './to-lower-case';

describe('data-first', () => {
  it('on lower case', () => {
    const result = toLowerCase('hello world');

    expectTypeOf(result).toEqualTypeOf<'hello world'>();
  });

  it('on upper case', () => {
    const result = toLowerCase('HELLO WORLD');

    expectTypeOf(result).toEqualTypeOf<'hello world'>();
  });

  it('on mixed case', () => {
    const result = toLowerCase('HeLlO WoRlD');

    expectTypeOf(result).toEqualTypeOf<'hello world'>();
  });

  it('on empty string', () => {
    const result = toLowerCase('');

    expectTypeOf(result).toEqualTypeOf<''>();
  });

  it('on non-literal string', () => {
    const result = toLowerCase('hello world' as string);

    expectTypeOf(result).toEqualTypeOf<Lowercase<string>>();
  });

  it('on template literal type', () => {
    const result = toLowerCase('PREFIX_123' as `PREFIX_${number}`);

    expectTypeOf(result).toEqualTypeOf<`prefix_${Lowercase<`${number}`>}`>();
  });
});

describe('data-last', () => {
  it('on lower case', () => {
    const result = pipe('hello world' as const, toLowerCase());

    expectTypeOf(result).toEqualTypeOf<'hello world'>();
  });

  it('on upper case', () => {
    const result = pipe('HELLO WORLD' as const, toLowerCase());

    expectTypeOf(result).toEqualTypeOf<'hello world'>();
  });

  it('on mixed case', () => {
    const result = pipe('HeLlO WoRlD' as const, toLowerCase());

    expectTypeOf(result).toEqualTypeOf<'hello world'>();
  });

  it('on empty string', () => {
    const result = pipe('' as const, toLowerCase());

    expectTypeOf(result).toEqualTypeOf<''>();
  });

  it('on non-literal string', () => {
    const result = pipe('hello world' as string, toLowerCase());

    expectTypeOf(result).toEqualTypeOf<Lowercase<string>>();
  });

  it('on template literal type', () => {
    const result = pipe('prefix_123' as `PREFIX_${number}`, toLowerCase());

    expectTypeOf(result).toEqualTypeOf<`prefix_${Lowercase<`${number}`>}`>();
  });
});

describe('unicode', () => {
  it('handles diacritics', () => {
    expectTypeOf(toLowerCase('CAFÉ NAÏVE')).toEqualTypeOf<'café naïve'>();
  });

  it('handles non-Latin scripts', () => {
    expectTypeOf(toLowerCase('МОСКВА')).toEqualTypeOf<'москва'>();
    expectTypeOf(toLowerCase('ΕΛΛΆΔΑ')).toEqualTypeOf<'ελλάδα'>();
  });

  it('handles surrogate pairs (astral plane)', () => {
    expectTypeOf(toLowerCase('𝒽ELLO')).toEqualTypeOf<'𝒽ello'>();
  });

  it('doesn\'t explode on emojis', () => {
    expectTypeOf(toLowerCase('🎉PARTY')).toEqualTypeOf<'🎉party'>();
  });

  it('handles combining characters', () => {
    expectTypeOf(toLowerCase('É\u0301LLO')).toEqualTypeOf<'é\u0301llo'>();
  });

  it('handles Turkish dotted I', () => {
    expectTypeOf(toLowerCase('İSTANBUL')).toEqualTypeOf<'i̇stanbul'>();
  });
});
