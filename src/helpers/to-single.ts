type Single<Func> = Func & { readonly single: true };

// eslint-disable-next-line ts/no-explicit-any -- Typescript requires using `any` to infer any kind of function type, `unknown` is not enough.
export const toSingle = <Func extends (...args: any) => unknown>(
  fn: Func,
): Single<Func> => Object.assign(fn, { single: true as const });
