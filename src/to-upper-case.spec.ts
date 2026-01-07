import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { toUpperCase } from './to-upper-case';

describe('data-first', () => {
  it('on lower case', () => {
    expect(toUpperCase('hello world')).toBe('HELLO WORLD');
  });

  it('on upper case', () => {
    expect(toUpperCase('HELLO WORLD')).toBe('HELLO WORLD');
  });

  it('on mixed case', () => {
    expect(toUpperCase('HeLlO WoRlD')).toBe('HELLO WORLD');
  });
});

describe('data-last', () => {
  it('on lower case', () => {
    expect(pipe('hello world', toUpperCase())).toBe('HELLO WORLD');
  });

  it('on upper case', () => {
    expect(pipe('HELLO WORLD', toUpperCase())).toBe('HELLO WORLD');
  });

  it('on mixed case', () => {
    expect(pipe('HeLlO WoRlD', toUpperCase())).toBe('HELLO WORLD');
  });
});

describe('unicode', () => {
  it('handles diacritics', () => {
    expect(toUpperCase('café naïve')).toBe('CAFÉ NAÏVE');
  });

  it('handles non-Latin scripts', () => {
    expect(toUpperCase('москва')).toBe('МОСКВА');
    expect(toUpperCase('ελλάδα')).toBe('ΕΛΛΆΔΑ');
  });

  it('doesn\'t explode on emojis', () => {
    expect(toUpperCase('🎉party')).toBe('🎉PARTY');
  });

  it('handles surrogate pairs (astral plane)', () => {
    expect(toUpperCase('𝒽ello')).toBe('𝒽ELLO');
  });

  it('handles combining characters', () => {
    expect(toUpperCase('e\u0301llo')).toBe('E\u0301LLO');
  });

  it('handles German eszett', () => {
    expect(toUpperCase('straße')).toBe('STRASSE');
  });

  it('handles Turkish dotted I', () => {
    expect(toUpperCase('i̇stanbul')).toBe('İSTANBUL');
  });
});
