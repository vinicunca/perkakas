import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { uncapitalize } from './uncapitalize';

describe('data-first', () => {
  it('empty string', () => {
    expect(uncapitalize('')).toBe('');
  });

  it('on lower case', () => {
    expect(uncapitalize('hello world')).toBe('hello world');
  });

  it('on upper case', () => {
    expect(uncapitalize('HELLO WORLD')).toBe('hELLO WORLD');
  });

  it('on mixed case', () => {
    expect(uncapitalize('HeLlO WoRlD')).toBe('heLlO WoRlD');
  });
});

describe('data-last', () => {
  it('empty string', () => {
    expect(pipe('', uncapitalize())).toBe('');
  });

  it('on lower case', () => {
    expect(pipe('hello world', uncapitalize())).toBe('hello world');
  });

  it('on upper case', () => {
    expect(pipe('HELLO WORLD', uncapitalize())).toBe('hELLO WORLD');
  });

  it('on mixed case', () => {
    expect(pipe('HeLlO WoRlD', uncapitalize())).toBe('heLlO WoRlD');
  });
});

describe('unicode', () => {
  it('maintains diacritics in rest of word', () => {
    expect(uncapitalize('Café Naïve')).toBe('café Naïve');
    expect(uncapitalize('CAFÉ NAÏVE')).toBe('cAFÉ NAÏVE');
  });

  it('handles non-Latin scripts', () => {
    expect(uncapitalize('Москва')).toBe('москва');
    expect(uncapitalize('Ελλάδα')).toBe('ελλάδα');
  });

  it('handles surrogate pairs (astral plane)', () => {
    expect(uncapitalize('𝒽Ello World')).toBe('𝒽Ello World');
  });

  it('doesn\'t explode on emojis', () => {
    expect(uncapitalize('🎉Party Time')).toBe('🎉Party Time');
  });

  it('handles combining characters', () => {
    expect(uncapitalize('É\u0301llo')).toBe('é\u0301llo');
  });

  it('single surrogate pair', () => {
    expect(uncapitalize('𝒽')).toBe('𝒽');
  });

  it('single accented character', () => {
    expect(uncapitalize('É')).toBe('é');
  });
});
