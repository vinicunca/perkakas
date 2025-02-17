import type { LazyResult } from './lazy-result';

export type LazyEvaluator<T = unknown, R = T> = (
  item: T,
  index: number,
  data: ReadonlyArray<T>,
) => LazyResult<R>;
