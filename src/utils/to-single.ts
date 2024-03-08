type Single<Func> = Func & { readonly single: true };

export function toSingle<Func extends (...args: any) => unknown>(fn: Func): Single<Func> {
  return Object.assign(fn, { single: true as const });
}
