import type { StrictFunction } from './types/strict-function';

type Single<Func> = Func & { readonly single: true };

export function toSingle<Func extends StrictFunction>(fn: Func): Single<Func> {
  return Object.assign(fn, { single: true as const });
}
