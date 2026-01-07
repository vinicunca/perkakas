import { describe, expect, it } from 'vitest';
import { capitalize } from './capitalize';
import { pipe } from './pipe';

describe('data-first', () => {
  it('empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('on lower case', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('on upper case', () => {
    expect(capitalize('HELLO WORLD')).toBe('HELLO WORLD');
  });

  it('on mixed case', () => {
    expect(capitalize('heLlO WoRlD')).toBe('HeLlO WoRlD');
  });

  it('from camel case', () => {
    expect(capitalize('helloWorld')).toBe('HelloWorld');
  });

  it('from pascal case', () => {
    expect(capitalize('HelloWorld')).toBe('HelloWorld');
  });

  it('from snake case', () => {
    expect(capitalize('hello_world')).toBe('Hello_world');
  });

  it('from kebab case', () => {
    expect(capitalize('hello-world')).toBe('Hello-world');
  });
});

describe('data-last', () => {
  it('empty string', () => {
    expect(pipe('', capitalize())).toBe('');
  });

  it('on lower case', () => {
    expect(pipe('hello world', capitalize())).toBe('Hello world');
  });

  it('on upper case', () => {
    expect(pipe('HELLO WORLD', capitalize())).toBe('HELLO WORLD');
  });

  it('on mixed case', () => {
    expect(pipe('heLlO WoRlD', capitalize())).toBe('HeLlO WoRlD');
  });
});

describe('unicode', () => {
  it('maintains diacritics in rest of word', () => {
    expect(capitalize('café naïve')).toBe('Café naïve');
    expect(capitalize('CAFÉ NAÏVE')).toBe('CAFÉ NAÏVE');
  });

  it('handles non-Latin scripts', () => {
    expect(capitalize('москва')).toBe('Москва');
    expect(capitalize('ελλάδα')).toBe('Ελλάδα');
  });

  it('handles surrogate pairs (astral plane)', () => {
    expect(capitalize('𝒽ello world')).toBe('𝒽ello world');
  });

  it('doesn\'t explode on emojis', () => {
    expect(capitalize('🎉party time')).toBe('🎉party time');
  });

  it('handles combining characters', () => {
    expect(capitalize('é\u0301llo')).toBe('É\u0301llo');
  });

  it('single accented char', () => {
    expect(capitalize('é')).toBe('É');
  });

  it('single surrogate pair', () => {
    expect(capitalize('𝒽')).toBe('𝒽');
  });
});
