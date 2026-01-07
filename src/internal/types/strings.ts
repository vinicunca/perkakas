type Splitter = '-' | '_' | '/' | '.';
type FirstOfString<S extends string> = S extends `${infer F}${string}`
  ? F
  : never;
type RemoveFirstOfString<S extends string> = S extends `${string}${infer R}`
  ? R
  : never;
type IsUpper<S extends string> = S extends Uppercase<S> ? true : false;
type IsLower<S extends string> = S extends Lowercase<S> ? true : false;
type SameLetterCase<X extends string, Y extends string>
  = IsUpper<X> extends IsUpper<Y>
    ? true
    : IsLower<X> extends IsLower<Y>
      ? true
      : false;
type CapitalizedWords<
  T extends ReadonlyArray<string>,
  Accumulator extends string = '',
  Normalize extends boolean | undefined = false,
> = T extends readonly [infer F extends string, ...infer R extends Array<string>]
  ? CapitalizedWords<
    R,
      `${Accumulator}${Capitalize<Normalize extends true ? Lowercase<F> : F>}`,
      Normalize
  >
  : Accumulator;
type JoinLowercaseWords<
  T extends ReadonlyArray<string>,
  Joiner extends string,
  Accumulator extends string = '',
> = T extends readonly [infer F extends string, ...infer R extends Array<string>]
  ? Accumulator extends ''
    ? JoinLowercaseWords<R, Joiner, `${Accumulator}${Lowercase<F>}`>
    : JoinLowercaseWords<R, Joiner, `${Accumulator}${Joiner}${Lowercase<F>}`>
  : Accumulator;

// eslint-disable-next-line ts/no-explicit-any
type LastOfArray<T extends Array<any>> = T extends [...any, infer R] ? R : never;
// eslint-disable-next-line ts/no-explicit-any
type RemoveLastOfArray<T extends Array<any>> = T extends [...infer F, any]
  ? F
  : never;

export interface CaseOptions {
  normalize?: boolean;
}

export type SplitByCase<
  T,
  Separator extends string = Splitter,
  Accumulator extends Array<unknown> = [],
> = string extends Separator
  ? Array<string>
  : T extends `${infer F}${infer R}`
    ? [LastOfArray<Accumulator>] extends [never]
        ? SplitByCase<R, Separator, [F]>
        : LastOfArray<Accumulator> extends string
          ? R extends ''
            ? SplitByCase<
              R,
              Separator,
              [
                ...RemoveLastOfArray<Accumulator>,
                `${LastOfArray<Accumulator>}${F}`,
              ]
            >
            : SameLetterCase<F, FirstOfString<R>> extends true
              ? F extends Separator
                ? FirstOfString<R> extends Separator
                  ? SplitByCase<R, Separator, [...Accumulator, '']>
                  : IsUpper<FirstOfString<R>> extends true
                    ? SplitByCase<
                      RemoveFirstOfString<R>,
                      Separator,
                      [...Accumulator, FirstOfString<R>]
                    >
                    : SplitByCase<R, Separator, [...Accumulator, '']>
                : SplitByCase<
                  R,
                  Separator,
                  [
                    ...RemoveLastOfArray<Accumulator>,
                    `${LastOfArray<Accumulator>}${F}`,
                  ]
                >
              : IsLower<F> extends true
                ? SplitByCase<
                  RemoveFirstOfString<R>,
                  Separator,
                  [
                    ...RemoveLastOfArray<Accumulator>,
                    `${LastOfArray<Accumulator>}${F}`,
                    FirstOfString<R>,
                  ]
                >
                : SplitByCase<R, Separator, [...Accumulator, F]>
          : never
    : Accumulator extends []
      ? T extends ''
        ? []
        : Array<string>
      : Accumulator;

export type JoinByCase<T, Joiner extends string> = string extends T
  ? string
  : Array<string> extends T
    ? string
    : T extends string
      ? SplitByCase<T> extends ReadonlyArray<string>
        ? JoinLowercaseWords<SplitByCase<T>, Joiner>
        : never
      : T extends ReadonlyArray<string>
        ? JoinLowercaseWords<T, Joiner>
        : never;

export type PascalCase<
  T,
  Normalize extends boolean | undefined = false,
> = string extends T
  ? string
  : Array<string> extends T
    ? string
    : T extends string
      ? SplitByCase<T> extends ReadonlyArray<string>
        ? CapitalizedWords<SplitByCase<T>, '', Normalize>
        : never
      : T extends ReadonlyArray<string>
        ? CapitalizedWords<T, '', Normalize>
        : never;

export type CamelCase<
  T,
  Normalize extends boolean | undefined = false,
> = string extends T
  ? string
  : Array<string> extends T
    ? string
    : Uncapitalize<PascalCase<T, Normalize>>;

export type KebabCase<
  T extends string | ReadonlyArray<string>,
  Joiner extends string = '-',
> = JoinByCase<T, Joiner>;

export type SnakeCase<T extends string | ReadonlyArray<string>> = JoinByCase<
  T,
  '_'
>;

export type TrainCase<
  T,
  Normalize extends boolean | undefined = false,
  Joiner extends string = '-',
> = string extends T
  ? string
  : Array<string> extends T
    ? string
    : T extends string
      ? SplitByCase<T> extends ReadonlyArray<string>
        ? CapitalizedWords<SplitByCase<T>, Joiner>
        : never
      : T extends ReadonlyArray<string>
        ? CapitalizedWords<T, Joiner, Normalize>
        : never;

export type FlatCase<
  T extends string | ReadonlyArray<string>,
  Joiner extends string = '',
> = JoinByCase<T, Joiner>;
