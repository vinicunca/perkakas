import { describe, expectTypeOf, it } from 'vitest';
import { pipe } from './pipe';
import { toCamelCase } from './to-camel-case';

describe('data-last', () => {
  it('without options', () => {
    const result = pipe('hello world' as const, toCamelCase());

    expectTypeOf(result).toEqualTypeOf<'helloWorld'>();
  });

  it('with options (preserveConsecutiveUppercase: true)', () => {
    const result = pipe(
      'fooBAR' as const,
      toCamelCase({ preserveConsecutiveUppercase: true }),
    );

    expectTypeOf(result).toEqualTypeOf<'fooBAR'>();
  });

  it('with options (preserveConsecutiveUppercase: false)', () => {
    const result = pipe(
      'fooBAR' as const,
      toCamelCase({ preserveConsecutiveUppercase: false }),
    );

    expectTypeOf(result).toEqualTypeOf<'fooBar'>();
  });
});

describe('tests copied from type-fest\'s tests', () => {
  it('pascal', () => {
    const result = toCamelCase('FooBar');

    expectTypeOf(result).toEqualTypeOf<'fooBar'>();
  });

  it('kebab', () => {
    const result = toCamelCase('foo-bar');

    expectTypeOf(result).toEqualTypeOf<'fooBar'>();
  });

  it('complex kebab', () => {
    const result = toCamelCase('foo-bar-abc-123');

    expectTypeOf(result).toEqualTypeOf<'fooBarAbc123'>();
  });

  it('space', () => {
    const result = toCamelCase('foo bar');

    expectTypeOf(result).toEqualTypeOf<'fooBar'>();
  });

  it('snake', () => {
    const result = toCamelCase('foo_bar');

    expectTypeOf(result).toEqualTypeOf<'fooBar'>();
  });

  it('no delimiter from mono', () => {
    const result = toCamelCase('foobar');

    expectTypeOf(result).toEqualTypeOf<'foobar'>();
  });

  it('mixed', () => {
    const result = toCamelCase('foo-bar_abc xyzBarFoo');

    expectTypeOf(result).toEqualTypeOf<'fooBarAbcXyzBarFoo'>();
  });

  it('vendor prefixed css property', () => {
    const result = toCamelCase('-webkit-animation');

    expectTypeOf(result).toEqualTypeOf<'webkitAnimation'>();
  });

  it('double prefixed kebab', () => {
    const result = toCamelCase('--very-prefixed');

    expectTypeOf(result).toEqualTypeOf<'veryPrefixed'>();
  });

  it('repeated separators', () => {
    const result = toCamelCase('foo____bar');

    expectTypeOf(result).toEqualTypeOf<'fooBar'>();
  });

  it('uppercase', () => {
    const result = toCamelCase('FOO');

    expectTypeOf(result).toEqualTypeOf<'foo'>();
  });

  it('lowercase', () => {
    const result = toCamelCase('foo');

    expectTypeOf(result).toEqualTypeOf<'foo'>();
  });

  it('screaming snake case', () => {
    const result = toCamelCase('FOO_BAR');

    expectTypeOf(result).toEqualTypeOf<'fooBar'>();
  });

  it('screaming kebab case', () => {
    const result = toCamelCase('FOO-BAR');

    expectTypeOf(result).toEqualTypeOf<'fooBar'>();
  });

  it('preserveConsecutiveUppercase: fooBAR', () => {
    const data = 'fooBAR';
    const whenTrue = toCamelCase(data, { preserveConsecutiveUppercase: true });

    expectTypeOf(whenTrue).toEqualTypeOf<'fooBAR'>();

    const whenFalse = toCamelCase(data, {
      preserveConsecutiveUppercase: false,
    });

    expectTypeOf(whenFalse).toEqualTypeOf<'fooBar'>();
  });

  it('preserveConsecutiveUppercase: fooBARBiz', () => {
    const data = 'fooBARBiz';
    const whenTrue = toCamelCase(data, { preserveConsecutiveUppercase: true });

    expectTypeOf(whenTrue).toEqualTypeOf<'fooBARBiz'>();

    const whenFalse = toCamelCase(data, {
      preserveConsecutiveUppercase: false,
    });

    expectTypeOf(whenFalse).toEqualTypeOf<'fooBarBiz'>();
  });

  it('preserveConsecutiveUppercase: foo BAR-Biz_BUZZ', () => {
    const data = 'foo BAR-Biz_BUZZ';
    const whenTrue = toCamelCase(data, { preserveConsecutiveUppercase: true });

    expectTypeOf(whenTrue).toEqualTypeOf<'fooBARBizBUZZ'>();

    const whenFalse = toCamelCase(data, {
      preserveConsecutiveUppercase: false,
    });

    expectTypeOf(whenFalse).toEqualTypeOf<'fooBarBizBuzz'>();
  });

  it('preserveConsecutiveUppercase: foo\tBAR-Biz_BUZZ', () => {
    const data = 'foo\tBAR-Biz_BUZZ';
    const whenTrue = toCamelCase(data, { preserveConsecutiveUppercase: true });

    expectTypeOf(whenTrue).toEqualTypeOf<'fooBARBizBUZZ'>();

    const whenFalse = toCamelCase(data, {
      preserveConsecutiveUppercase: false,
    });

    expectTypeOf(whenFalse).toEqualTypeOf<'fooBarBizBuzz'>();
  });
});

it('fallback when regular string', () => {
  const result = toCamelCase('hello world' as string);

  expectTypeOf(result).toEqualTypeOf<string>();
});

it('with template literal type (lowercase)', () => {
  const result = toCamelCase('this_is_1' as `this_is_${number}`);

  expectTypeOf(result).toEqualTypeOf<`thisIs${Capitalize<`${number}`>}`>();
});

it('with template literal type (uppercase)', () => {
  const result = toCamelCase('THIS_IS_1' as `THIS_IS_${number}`);

  expectTypeOf(result).toEqualTypeOf<`tHISIS${Capitalize<`${number}`>}`>();
});

describe('implicit default \'preserveConsecutiveUppercase\' option matches explicit setting', () => {
  it('fooBAR', () => {
    const data = 'fooBAR';

    expectTypeOf(toCamelCase(data)).toEqualTypeOf(
      toCamelCase(data, { preserveConsecutiveUppercase: true }),
    );
  });

  it('fooBARBiz', () => {
    const data = 'fooBARBiz';

    expectTypeOf(toCamelCase(data)).toEqualTypeOf(
      toCamelCase(data, { preserveConsecutiveUppercase: true }),
    );
  });

  it('foo BAR-Biz_BUZZ', () => {
    const data = 'foo BAR-Biz_BUZZ';

    expectTypeOf(toCamelCase(data)).toEqualTypeOf(
      toCamelCase(data, { preserveConsecutiveUppercase: true }),
    );
  });

  it('foo\tBAR-Biz_BUZZ', () => {
    const data = 'foo\tBAR-Biz_BUZZ';

    expectTypeOf(toCamelCase(data)).toEqualTypeOf(
      toCamelCase(data, { preserveConsecutiveUppercase: true }),
    );
  });
});
