import { pipe } from './pipe';
import { split } from './split';

describe('runtime', () => {
  it('empty string, empty separator', () => {
    expect(split('', '')).toEqual([]);
  });

  it('empty string, non-empty separator', () => {
    expect(split('', ',')).toEqual(['']);
  });

  it('trivial split', () => {
    expect(split('a', ',')).toEqual(['a']);
  });

  it('string contains separator', () => {
    expect(split(',', ',')).toEqual(['', '']);
  });

  it('useful split', () => {
    expect(split('a,b,c', ',')).toEqual(['a', 'b', 'c']);
  });

  it('regex split', () => {
    expect(split('a,b,c', /,/u)).toEqual(['a', 'b', 'c']);
  });

  it('multiple types of separators', () => {
    expect(split('a,b;c', /[;,]/u)).toEqual(['a', 'b', 'c']);
  });

  it('regex with limit', () => {
    expect(split('a,b,c', /,/u, 2)).toEqual(['a', 'b']);
  });

  it('limited split', () => {
    expect(split('a,b,c', ',', 2)).toEqual(['a', 'b']);
  });

  it('limit is higher than splits', () => {
    expect(split('a,b,c', ',', 5)).toEqual(['a', 'b', 'c']);
  });

  it('multiple consecutive separators', () => {
    expect(split('a,,b', ',')).toEqual(['a', '', 'b']);
  });

  it('separator at the start and end', () => {
    expect(split(',a,b,', ',')).toEqual(['', 'a', 'b', '']);
  });

  it('empty-string separator', () => {
    expect(split('abcdef', '')).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });

  it('undefined limit', () => {
    expect(split('a,b,c', ',', undefined)).toEqual(['a', 'b', 'c']);
  });

  it('negative limit', () => {
    expect(split('a,b,c', ',', -1)).toEqual(['a', 'b', 'c']);
  });

  it('fractional limits', () => {
    expect(split('a,b,c', ',', 1.5)).toEqual(['a']);
  });

  it('0 limit', () => {
    expect(split('a,b,c', ',', 0)).toEqual([]);
  });

  describe('dataLast', () => {
    it('useful split', () => {
      expect(pipe('a,b,c', split(','))).toEqual(['a', 'b', 'c']);
    });

    it('regex split', () => {
      expect(pipe('a,b,c', split(/,/u))).toEqual(['a', 'b', 'c']);
    });

    it('limited split', () => {
      expect(pipe('a,b,c', split(',', 2))).toEqual(['a', 'b']);
    });

    it('regex with limit', () => {
      expect(pipe('a,b,c', split(/,/u, 2))).toEqual(['a', 'b']);
    });

    it('undefined limit', () => {
      expect(pipe('a,b,c', split(',', undefined))).toEqual(['a', 'b', 'c']);
    });
  });
});

describe('typing', () => {
  it('non-literals', () => {
    const result = split('' as string, '' as string);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it('non-literal data', () => {
    const result = split('' as string, ',');
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it('non-literal separator', () => {
    const result = split('', ',' as string);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it('non-literal limit', () => {
    const result = split('', '', 1 as number);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it('literal empty strings', () => {
    const result = split('', '');
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('trivial literals', () => {
    const result = split('a', ',');
    expectTypeOf(result).toEqualTypeOf<['a']>();
  });

  it('string contains separator', () => {
    const result = split(',', ',');
    expectTypeOf(result).toEqualTypeOf<['', '']>();
  });

  it('useful split', () => {
    const result = split('a,b,c', ',');
    expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c']>();
  });

  it('regex split', () => {
    const result = split('a,b,c', /,/u);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it('limited split', () => {
    const result = split('a,b,c', ',', 2);
    expectTypeOf(result).toEqualTypeOf<['a', 'b']>();
  });

  it('limit is higher than splits', () => {
    const result = split('a,b,c', ',', 5);
    expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c']>();
  });

  it('undefined limit', () => {
    const result = split('a,b,c', ',', undefined);
    expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c']>();
  });

  it('multiple consecutive separators', () => {
    const result = split('a,,b', ',');
    expectTypeOf(result).toEqualTypeOf<['a', '', 'b']>();
  });

  it('separator at the start and end', () => {
    const result = split(',a,b,', ',');
    expectTypeOf(result).toEqualTypeOf<['', 'a', 'b', '']>();
  });

  it('empty string separator', () => {
    const result = split('abcdef', '');
    expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c', 'd', 'e', 'f']>();
  });

  it('empty everything', () => {
    const result = split('', '');
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('literal string with multiple character separator', () => {
    const result = split('a--b--c', '--');
    expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c']>();
  });

  it('negative limit', () => {
    const result = split('a,b,c', ',', -1);
    expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c']>();
  });

  it('fractional limits', () => {
    const result = split('a,b,c', ',', 1.5);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it('0 limit', () => {
    const result = split('a,b,c', ',', 0);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });
});
