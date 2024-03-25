type Single<Func> = Func & { readonly single: true };

export function _toSingle<Func extends (...args: any) => unknown>(fn: Func): Single<Func> {
  return Object.assign(fn, { single: true as const });
}
