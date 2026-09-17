import type { LazyEvaluator } from './lazy-evaluator';

export interface LazyDefinition {
  // eslint-disable-next-line ts/no-explicit-any -- This allows typescript the most flexibility in inferring function types, `unknown` doesn't always work!
  readonly lazy: LazyMeta & ((...args: any) => LazyEvaluator);
  readonly lazyArgs: ReadonlyArray<unknown>;
}

interface LazyMeta {
  readonly single?: boolean;
}
