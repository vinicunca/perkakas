import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { toLowerCase } from './to-lower-case';

describe('data-first', () => {
  it('on lower case', () => {
    expect(toLowerCase('hello world')).toBe('hello world');
  });

  it('on upper case', () => {
    expect(toLowerCase('HELLO WORLD')).toBe('hello world');
  });

  it('on mixed case', () => {
    expect(toLowerCase('HeLlO WoRlD')).toBe('hello world');
  });
});

describe('data-last', () => {
  it('on lower case', () => {
    expect(pipe('hello world', toLowerCase())).toBe('hello world');
  });

  it('on upper case', () => {
    expect(pipe('HELLO WORLD', toLowerCase())).toBe('hello world');
  });

  it('on mixed case', () => {
    expect(pipe('HeLlO WoRlD', toLowerCase())).toBe('hello world');
  });
});

describe('unicode', () => {
  it('handles diacritics', () => {
    expect(toLowerCase('CAFÉ NAÏVE')).toBe('café naïve');
  });

  it('handles non-Latin scripts', () => {
    expect(toLowerCase('МОСКВА')).toBe('москва');
    expect(toLowerCase('ΕΛΛΆΔΑ')).toBe('ελλάδα');
  });

  it('handles surrogate pairs (astral plane)', () => {
    expect(toLowerCase('𝒽ELLO')).toBe('𝒽ello');
  });

  it('doesn\'t explode on emojis', () => {
    expect(toLowerCase('🎉PARTY')).toBe('🎉party');
  });

  it('handles combining characters', () => {
    expect(toLowerCase('É\u0301LLO')).toBe('é\u0301llo');
  });

  it('handles Turkish dotted I', () => {
    expect(toLowerCase('İSTANBUL')).toBe('i̇stanbul');
  });
});
