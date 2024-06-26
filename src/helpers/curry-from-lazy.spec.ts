/* eslint-disable ts/explicit-function-return-type --
 * purry is all about functions, so we need to turn these off to make it easy
 * to write the tests.
 */

import type { LazyEvaluator } from '../pipe';

import { curryFromLazy } from './curry-from-lazy';

describe('runtime', () => {
  it('throws on wrong number of arguments', () => {
    const zeroArgsLazyImpl = (): LazyEvaluator => () =>
      ({ done: true, hasNext: false }) as const;

    const zeroArgsPurried = (...args: ReadonlyArray<unknown>) =>
      curryFromLazy(zeroArgsLazyImpl, args);

    expect(() =>
      zeroArgsPurried(
        // The first argument to the lazy purried function will always be an
        // array.
        ['hello'],
        // But from the second param and onward the params belong to the lazy
        // impl. Because our lazy impl takes 0 args, this extra param should
        // throw.
        'world',
      )).toThrowError('Wrong number of arguments');
  });
});
