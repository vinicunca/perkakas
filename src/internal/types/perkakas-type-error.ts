import type { Tagged } from 'type-fest';

/* v8 ignore next 2 */
// eslint-disable-next-line ts/no-unused-vars -- This symbol should only be used for PerkakasTypeError
const PerkakasErrorSymbol = Symbol('PerkakasError');

interface PerkakasTypeErrorOptions {
  type?: unknown;
  metadata?: unknown;
}

/**
 * Used for reporting type errors in a more useful way than `never`.
 */
export type PerkakasTypeError<
  // Type errors don't have stack traces so we need good strings to be able to
  // grep for them and debug them.
  FunctionName extends string,
  Message extends number | string,
  // eslint-disable-next-line ts/no-empty-object-type
  Options extends PerkakasTypeErrorOptions = {},
> = Tagged<
  Options extends { type: infer T } ? T : typeof PerkakasErrorSymbol,
  `PerkakasTypeError(${FunctionName}): ${Message}.`,
  Options extends { metadata: infer Metadata } ? Metadata : never
>;
