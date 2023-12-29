import { vi } from 'vitest';

import { map } from '../src/array/map';

export function createLazyInvocationCounter() {
  const count = vi.fn();
  return {
    count,
    fn: <T>() =>
      map<T, T>((x) => {
        count();
        return x;
      }),
  };
}
