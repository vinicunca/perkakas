import type { Tagged } from 'type-fest';

/* v8 ignore next 2 */
// eslint-disable-next-line ts/no-unused-vars -- This symbol should only be used for PerkakasTypeError
const PerkakasErrorSymbol = Symbol('PerkakasError');

/**
 * Used for reporting type errors in a more useful way than `never`. Use
 * numbers for things that should never happen.
 */
export type PerkakasTypeError<
  FunctionName extends string,
  Message extends number | string,
> = Message extends string
  ? Tagged<
      typeof PerkakasErrorSymbol,
      `PerkakasTypeError(${FunctionName}): ${Message}.`
  >
  : PerkakasTypeError<
    FunctionName,
      `Internal error ${Message}. Please open a Perkakas GitHub issue.`
  >;
