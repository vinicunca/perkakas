/* eslint-disable ts/explicit-function-return-type --
 * curry is all about functions, so we need to turn these off to make it easy
 * to write the tests.
 */

import type { LazyEvaluator } from './types/lazy-evaluator';
import { curryFromLazy } from './curry-from-lazy';

it('throws on wrong number of arguments', () => {
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

const evaluator: LazyEvaluator = () => {
  throw new Error('unreachable');
};

/* v8 ignore next 4 -- We only need the function pointer, we never call it! */
const zeroArgsLazyImpl = () => evaluator;

function zeroArgsPurried(...args: ReadonlyArray<unknown>) {
  return curryFromLazy(zeroArgsLazyImpl, args);
}
