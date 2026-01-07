import { describe, expectTypeOf, it } from 'vitest';
import { pipe } from './pipe';
import { uncapitalize } from './uncapitalize';

describe('data-first', () => {
  it('on lower case', () => {
    const result = uncapitalize('hello world');

    expectTypeOf(result).toEqualTypeOf<'hello world'>();
  });

  it('on upper case', () => {
    const result = uncapitalize('HELLO WORLD');

    expectTypeOf(result).toEqualTypeOf<'hELLO WORLD'>();
  });

  it('on mixed case', () => {
    const result = uncapitalize('HeLlO WoRlD');

    expectTypeOf(result).toEqualTypeOf<'heLlO WoRlD'>();
  });

  it('on empty string', () => {
    const result = uncapitalize('');

    expectTypeOf(result).toEqualTypeOf<''>();
  });

  it('on non-literal string', () => {
    const result = uncapitalize('hello world' as string);

    expectTypeOf(result).toEqualTypeOf<Uncapitalize<string>>();
  });

  it('on template literal type', () => {
    const result = uncapitalize('PREFIX_123' as `PREFIX_${number}`);

    expectTypeOf(result).toEqualTypeOf<`pREFIX_${number}`>();
  });
});

describe('data-last', () => {
  it('on lower case', () => {
    const result = pipe('hello world' as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<'hello world'>();
  });

  it('on upper case', () => {
    const result = pipe('HELLO WORLD' as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<'hELLO WORLD'>();
  });

  it('on mixed case', () => {
    const result = pipe('HeLlO WoRlD' as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<'heLlO WoRlD'>();
  });

  it('on empty string', () => {
    const result = pipe('' as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<''>();
  });

  it('on non-literal string', () => {
    const result = pipe('hello world' as string, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<Uncapitalize<string>>();
  });

  it('on template literal type', () => {
    const result = pipe('PREFIX_123' as `PREFIX_${number}`, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<`pREFIX_${number}`>();
  });
});

describe('unicode', () => {
  it('maintains diacritics in rest of word', () => {
    expectTypeOf(uncapitalize('Café Naïve')).toEqualTypeOf<'café Naïve'>();
    expectTypeOf(uncapitalize('CAFÉ NAÏVE')).toEqualTypeOf<'cAFÉ NAÏVE'>();
  });

  it('handles non-Latin scripts', () => {
    expectTypeOf(uncapitalize('Москва')).toEqualTypeOf<'москва'>();
    expectTypeOf(uncapitalize('Ελλάδα')).toEqualTypeOf<'ελλάδα'>();
  });

  it('handles surrogate pairs (astral plane)', () => {
    expectTypeOf(uncapitalize('𝒽Ello World')).toEqualTypeOf<'𝒽Ello World'>();
  });

  it('doesn\'t explode on emojis', () => {
    expectTypeOf(uncapitalize('🎉Party Time')).toEqualTypeOf<'🎉Party Time'>();
  });

  it('handles combining characters', () => {
    expectTypeOf(uncapitalize('É\u0301llo')).toEqualTypeOf<'é\u0301llo'>();
  });

  it('single surrogate pair', () => {
    expectTypeOf(uncapitalize('𝒽')).toEqualTypeOf<'𝒽'>();
  });

  it('single accented character', () => {
    expectTypeOf(uncapitalize('É')).toEqualTypeOf<'é'>();
  });
});
