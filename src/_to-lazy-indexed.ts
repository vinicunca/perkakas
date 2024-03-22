export function toLazyIndexed<Func extends (...args: any) => unknown>(fn: Func): Func & { readonly indexed: true } {
  return Object.assign(fn, { indexed: true as const });
}
