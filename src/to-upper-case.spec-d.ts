import { describe, expectTypeOf, it } from 'vitest';
import { pipe } from './pipe';
import { toUpperCase } from './to-upper-case';

describe('data-first', () => {
  it('on lower case', () => {
    const result = toUpperCase('hello world');

    expectTypeOf(result).toEqualTypeOf<'HELLO WORLD'>();
  });

  it('on upper case', () => {
    const result = toUpperCase('HELLO WORLD');

    expectTypeOf(result).toEqualTypeOf<'HELLO WORLD'>();
  });

  it('on mixed case', () => {
    const result = toUpperCase('HeLlO WoRlD');

    expectTypeOf(result).toEqualTypeOf<'HELLO WORLD'>();
  });

  it('on empty string', () => {
    const result = toUpperCase('');

    expectTypeOf(result).toEqualTypeOf<''>();
  });

  it('on non-literal string', () => {
    const result = toUpperCase('hello world' as string);

    expectTypeOf(result).toEqualTypeOf<Uppercase<string>>();
  });

  it('on template literal type', () => {
    const result = toUpperCase('prefix_123' as `prefix_${number}`);

    expectTypeOf(result).toEqualTypeOf<`PREFIX_${Uppercase<`${number}`>}`>();
  });
});

describe('data-last', () => {
  it('on lower case', () => {
    const result = pipe('hello world' as const, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<'HELLO WORLD'>();
  });

  it('on upper case', () => {
    const result = pipe('HELLO WORLD' as const, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<'HELLO WORLD'>();
  });

  it('on mixed case', () => {
    const result = pipe('HeLlO WoRlD' as const, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<'HELLO WORLD'>();
  });

  it('on empty string', () => {
    const result = pipe('' as const, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<''>();
  });

  it('on non-literal string', () => {
    const result = pipe('hello world' as string, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<Uppercase<string>>();
  });

  it('on template literal type', () => {
    const result = pipe('prefix_123' as `prefix_${number}`, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<`PREFIX_${Uppercase<`${number}`>}`>();
  });
});

describe('unicode', () => {
  it('handles diacritics', () => {
    expectTypeOf(toUpperCase('café naïve')).toEqualTypeOf<'CAFÉ NAÏVE'>();
  });

  it('handles non-Latin scripts', () => {
    expectTypeOf(toUpperCase('москва')).toEqualTypeOf<'МОСКВА'>();
    expectTypeOf(toUpperCase('ελλάδα')).toEqualTypeOf<'ΕΛΛΆΔΑ'>();
  });

  it('doesn\'t explode on emojis', () => {
    expectTypeOf(toUpperCase('🎉party')).toEqualTypeOf<'🎉PARTY'>();
  });

  it('handles surrogate pairs (astral plane)', () => {
    expectTypeOf(toUpperCase('𝒽ello')).toEqualTypeOf<'𝒽ELLO'>();
  });

  it('handles combining characters', () => {
    expectTypeOf(toUpperCase('e\u0301llo')).toEqualTypeOf<'E\u0301LLO'>();
  });

  it('handles German eszett', () => {
    expectTypeOf(toUpperCase('straße')).toEqualTypeOf<'STRASSE'>();
  });

  it('handles Turkish dotted I', () => {
    expectTypeOf(toUpperCase('i̇stanbul')).toEqualTypeOf<'İSTANBUL'>();
  });
});
