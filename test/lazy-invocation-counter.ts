/* eslint-disable ts/explicit-function-return-type, ts/explicit-module-boundary-types */

import { vi } from 'vitest';

import { map } from '../src/map';

export function createLazyInvocationCounter() {
  const count = vi.fn();
  return {
    count,
    fn: <T>() =>
      map<ReadonlyArray<T>, T>((x) => {
        count();
        return x;
      }),
  };
}
