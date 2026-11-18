import type { PerkakasTypeError } from './perkakas-type-error';
import type { StrictFunction } from './strict-function';

/**
 * The type of a utility's data-last builder, derived from the data-first
 * implementation so the two stay coupled and the builder's parameters and
 * `data` aren't retyped by hand.
 *
 * A generic implementation's type parameters resolve to their constraints; the
 * utility's overloads carry the precise types.
 *
 * @example
 *   const dataLast: DataLastBuilder<typeof mapImplementation> =
 *     (callbackfn) => (data) =>
 *       mapImplementation(data, callbackfn);
 */
export type DataLastBuilder<F extends StrictFunction>
  = Parameters<F> extends readonly [infer Data, ...infer Parameters]
    ? (...parameters: Parameters) => (data: Data) => ReturnType<F>
    : PerkakasTypeError<
      'DataLastBuilder',
      'failed to parse data-first implementation signature',
      { metadata: F }
    >;
