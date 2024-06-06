import { stringToPath } from './string-to-path';

describe('runtime', () => {
  it('empty path', () => {
    expect(stringToPath('')).toStrictEqual([]);
  });

  it('single propName', () => {
    expect(stringToPath('a')).toStrictEqual(['a']);
  });

  it('single index', () => {
    expect(stringToPath('[0]')).toStrictEqual(['0']);
  });

  it('should handle short path with only bracket access', () => {
    expect(stringToPath('foo[bar]')).toEqual(['foo', 'bar']);
  });

  it('should handle bracket access at the end', () => {
    const res = stringToPath('foo.bar[3]');
    expect(res).toEqual(['foo', 'bar', '3']);
  });

  it('should convert a string to a deeply nested path', () => {
    expect(stringToPath('foo.bar[3].baz')).toStrictEqual([
      'foo',
      'bar',
      '3',
      'baz',
    ]);
  });

  it('should handle nested dot paths', () => {
    expect(stringToPath('foo[bar.baz].qui.che')).toStrictEqual([
      'foo',
      'bar.baz',
      'qui',
      'che',
    ]);
  });

  describe('erroneous edge-cases', () => {
    it('index with string value', () => {
      // The function accepts these, is this a valid input?
      expect(stringToPath('[a]')).toStrictEqual(['a']);
    });

    it('prop name with numbers', () => {
      // The function accepts these, is this a valid input?
      expect(stringToPath('1')).toStrictEqual(['1']);
    });

    it.each(
      // ¯\_(ツ)_/¯
      ['.', '..', '[', ']', '[[', ']]', '[.', '].', '.[', '.]'],
    )('malformed input: %s', (input) => {
      expect(stringToPath(input)).toStrictEqual([input]);
    });
  });
});

describe('typing', () => {
  it('should convert a string to a deeply nested path', () => {
    const result = stringToPath('a.b[0].c');
    expectTypeOf(result).toEqualTypeOf<['a', 'b', '0', 'c']>();
  });

  it('simple const string are inferred', () => {
    const result = stringToPath('foo[bar.baz].qui');
    expectTypeOf(result).toEqualTypeOf<['foo', 'bar.baz', 'qui']>();
  });

  it('should handle long paths', () => {
    const result = stringToPath(
      'lorem.ipsum[dolor.sit].amet.con.sec.tetur[adi.pisc.ing].elit.42',
    );
    expectTypeOf(result).toEqualTypeOf<
      [
        'lorem',
        'ipsum',
        'dolor.sit',
        'amet',
        'con',
        'sec',
        'tetur',
        'adi.pisc.ing',
        'elit',
        '42',
      ]
    >();
  });

  it('dynamic strings cannot be inferred', () => {
    const result = stringToPath(`foo.${'bar' as string}[baz]`);
    expectTypeOf(result).toEqualTypeOf<never>();
  });
});
