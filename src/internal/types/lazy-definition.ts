import type { LazyResult } from './lazy-result';

export interface LazyDefinition {
  // eslint-disable-next-line ts/no-explicit-any -- This allows typescript the most flexibility in inferring function types, `unknown` doesn't always work!
  readonly lazy: LazyMeta & ((...args: any) => LazyFn);
  readonly lazyArgs: ReadonlyArray<unknown>;
}

type LazyFn = (
  value: unknown,
  index: number,
  items: ReadonlyArray<unknown>,
) => LazyResult<unknown>;

interface LazyMeta {
  readonly single?: boolean;
}
