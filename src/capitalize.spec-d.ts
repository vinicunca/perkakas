import { describe, expectTypeOf, it } from 'vitest';
import { capitalize } from './capitalize';
import { pipe } from './pipe';

describe('data-first', () => {
  it('on lower case', () => {
    const result = capitalize('hello world');

    expectTypeOf(result).toEqualTypeOf<'Hello world'>();
  });

  it('on upper case', () => {
    const result = capitalize('HELLO WORLD');

    expectTypeOf(result).toEqualTypeOf<'HELLO WORLD'>();
  });

  it('on mixed case', () => {
    const result = capitalize('heLlO WoRlD');

    expectTypeOf(result).toEqualTypeOf<'HeLlO WoRlD'>();
  });

  it('on empty string', () => {
    const result = capitalize('');

    expectTypeOf(result).toEqualTypeOf<''>();
  });

  it('on non-literal string', () => {
    const result = capitalize('hello world' as string);

    expectTypeOf(result).toEqualTypeOf<Capitalize<string>>();
  });

  it('on template literal type', () => {
    const result = capitalize('prefix_123' as `prefix_${number}`);

    expectTypeOf(result).toEqualTypeOf<`Prefix_${number}`>();
  });
});

describe('data-last', () => {
  it('on lower case', () => {
    const result = pipe('hello world' as const, capitalize());

    expectTypeOf(result).toEqualTypeOf<'Hello world'>();
  });

  it('on upper case', () => {
    const result = pipe('HELLO WORLD' as const, capitalize());

    expectTypeOf(result).toEqualTypeOf<'HELLO WORLD'>();
  });

  it('on mixed case', () => {
    const result = pipe('heLlO WoRlD' as const, capitalize());

    expectTypeOf(result).toEqualTypeOf<'HeLlO WoRlD'>();
  });

  it('on empty string', () => {
    const result = pipe('' as const, capitalize());

    expectTypeOf(result).toEqualTypeOf<''>();
  });

  it('on non-literal string', () => {
    const result = pipe('hello world' as string, capitalize());

    expectTypeOf(result).toEqualTypeOf<Capitalize<string>>();
  });

  it('on template literal type', () => {
    const result = pipe('prefix_123' as `prefix_${number}`, capitalize());

    expectTypeOf(result).toEqualTypeOf<`Prefix_${number}`>();
  });
});

describe('unicode', () => {
  it('maintains diacritics in rest of word', () => {
    expectTypeOf(capitalize('café naïve')).toEqualTypeOf<'Café naïve'>();
    expectTypeOf(capitalize('CAFÉ NAÏVE')).toEqualTypeOf<'CAFÉ NAÏVE'>();
  });

  it('handles non-Latin scripts', () => {
    expectTypeOf(capitalize('москва')).toEqualTypeOf<'Москва'>();
    expectTypeOf(capitalize('ελλάδα')).toEqualTypeOf<'Ελλάδα'>();
  });

  it('handles surrogate pairs (astral plane)', () => {
    expectTypeOf(capitalize('𝒽ello world')).toEqualTypeOf<'𝒽ello world'>();
  });

  it('doesn\'t explode on emojis', () => {
    expectTypeOf(capitalize('🎉party time')).toEqualTypeOf<'🎉party time'>();
  });

  it('handles combining characters', () => {
    expectTypeOf(capitalize('é\u0301llo')).toEqualTypeOf<'É\u0301llo'>();
  });

  it('single accented char', () => {
    expectTypeOf(capitalize('é')).toEqualTypeOf<'É'>();
  });

  it('single surrogate pair', () => {
    expectTypeOf(capitalize('𝒽')).toEqualTypeOf<'𝒽'>();
  });
});
