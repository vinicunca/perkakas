import type { Join, Words } from 'type-fest';
import { curry } from './curry';
import { words } from './internal/words';

type SnakeCase<S extends string> = string extends S
  ? string
  : Lowercase<Join<Words<S>, '_'>>;

/**
 * Converts text to **snake_case** by splitting it into words and joining them
 * back together with underscores (`_`), then lowercasing the result.
 *
 * Because it uses [`toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase),
 * the function shares its _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_
 * too, making it best suited for simple strings like identifiers and internal
 * keys. For linguistic text processing, use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
 * with [`granularity: "word"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter#parameters), and
 * [`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
 * which are purpose-built to handle nuances in languages and locales.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toTitleCase`.
 *
 * For *CONSTANT_CASE* use `toUpperCase(toSnakeCase(data))`.
 *
 * @param data - A string.
 * @signature
 *   P.toSnakeCase(data);
 * @example
 *   P.toSnakeCase("hello world"); // "hello_world"
 *   P.toSnakeCase("__HELLO_WORLD__"); // "hello_world"
 * @dataFirst
 * @category String
 */
export function toSnakeCase<S extends string>(data: S): SnakeCase<S>;

/**
 * Converts text to **snake_case** by splitting it into words and joining them
 * back together with underscores (`_`), then lowercasing the result.
 *
 * Because it uses [`toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase),
 * the function shares its _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_
 * too, making it best suited for simple strings like identifiers and internal
 * keys. For linguistic text processing, use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
 * with [`granularity: "word"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter#parameters), and
 * [`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
 * which are purpose-built to handle nuances in languages and locales.
 *
 * For other case manipulations see: `toLowerCase`, `toUpperCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, and `toTitleCase`.
 *
 * For *CONSTANT_CASE* use `toUpperCase(toSnakeCase(data))`.
 *
 * @signature
 *   P.toSnakeCase()(data);
 * @example
 *   P.pipe("hello world", P.toSnakeCase()); // "hello_world"
 *   P.pipe("__HELLO_WORLD__", P.toSnakeCase()); // "hello_world"
 * @dataLast
 * @category String
 */
export function toSnakeCase(): <S extends string>(data: S) => SnakeCase<S>;

export function toSnakeCase(...args: ReadonlyArray<unknown>): unknown {
  return curry(toSnakeCaseImplementation, args);
}

function toSnakeCaseImplementation<S extends string>(data: S): SnakeCase<S> {
  // @ts-expect-error [ts2322] -- To avoid importing our own utilities for this
  // we are using the built-in `join` and `toLowerCase` functions which aren't
  // typed as well. This is equivalent to `toLowerCase(join(words(data), "_"))`
  // which TypeScript infers correctly as SnakeCase.
  return words(data).join('_').toLowerCase();
}
