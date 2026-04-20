import { describe, expect, it } from 'vitest';
import { conditional } from './conditional';
import { constant } from './constant';
import { isDeepEqual } from './is-deep-equal';
import { pipe } from './pipe';

describe('runtime (dataFirst)', () => {
  it('accepts and runs a default/fallback case', () => {
    expect(
      conditional(
        'Jokic',
        [constant(false), constant('hello')],
        constant(undefined),
      ),
    ).toBeUndefined();
  });

  it('falls back to our default', () => {
    expect(
      conditional(
        'Jokic',
        [constant(false), constant('world')],
        constant('hello'),
      ),
    ).toBe('hello');
  });

  it('works with a single case', () => {
    expect(conditional('Jokic', [isDeepEqual('Jokic'), () => 'center'])).toBe(
      'center',
    );
  });

  it('works with two cases', () => {
    expect(
      conditional(
        'Jokic',
        [isDeepEqual('Murray'), () => 'point guard'],
        [isDeepEqual('Jokic'), () => 'center'],
      ),
    ).toBe('center');
  });

  it('picks the first matching case', () => {
    expect(
      conditional(
        'Jokic',
        [isDeepEqual('Jokic'), () => 'center'],
        [isDeepEqual('Jokic'), () => 'mvp'],
      ),
    ).toBe('center');
  });

  it('throws when no matching case', () => {
    expect(() =>
      conditional('Jokic', [() => false, () => 'world'])).toThrowErrorMatchingInlineSnapshot(
      '[Error: conditional: data failed for all cases]',
    );
  });
});

describe('runtime (dataLast)', () => {
  it('should return value of first pair', () => {
    const value = pipe(
      'Jokic',
      conditional(
        [isDeepEqual('Murray'), () => 'point guard'],
        [isDeepEqual('Jokic'), () => 'center'],
        [isDeepEqual('Jokic'), () => 'mvp'],
      ),
    );

    expect(value).toBe('center');
  });
});
