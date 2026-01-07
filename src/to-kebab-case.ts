import type { Join, Words } from 'type-fest';
import { curry } from './curry';
import { words } from './internal/words';

type KebabCase<S extends string> = string extends S
  ? string
  : Lowercase<Join<Words<S>, '-'>>;

/**
 * Converts text to **kebab-case** by splitting it into words and joining them
 * back together with hyphens (`-`), then lowercasing the result.
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
 * `uncapitalize`, `toCamelCase`, `toSnakeCase`, and `toTitleCase`.
 *
 * For *COBOL-CASE* use `toUpperCase(toKebabCase(data))`.
 *
 * @param data - A string.
 * @signature
 *   P.toKebabCase(data);
 * @example
 *   P.toKebabCase("hello world"); // "hello-world"
 *   P.toKebabCase("__HELLO_WORLD__"); // "hello-world"
 * @dataFirst
 * @category String
 */
export function toKebabCase<S extends string>(data: S): KebabCase<S>;

/**
 * Converts text to **kebab-case** by splitting it into words and joining them
 * back together with hyphens (`-`), then lowercasing the result.
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
 * `uncapitalize`, `toCamelCase`, `toSnakeCase`, and `toTitleCase`.
 *
 * For *COBOL-CASE* use `toUpperCase(toKebabCase(data))`.
 *
 * @signature
 *   P.toKebabCase()(data);
 * @example
 *   P.pipe("hello world", P.toKebabCase()); // "hello-world"
 *   P.pipe("__HELLO_WORLD__", P.toKebabCase()); // "hello-world"
 * @dataLast
 * @category String
 */
export function toKebabCase(): <S extends string>(data: S) => KebabCase<S>;

export function toKebabCase(...args: ReadonlyArray<unknown>): unknown {
  return curry(toKebabCaseImplementation, args);
}

function toKebabCaseImplementation<S extends string>(data: S): KebabCase<S> {
  // @ts-expect-error [ts2322] -- To avoid importing our own utilities for this
  // we are using the built-in `join` and `toLowerCase` functions which aren't
  // typed as well. This is equivalent to `toLowerCase(join(words(data), "-"))`
  // which TypeScript infers correctly as KebabCase.
  return words(data).join('-').toLowerCase();
}
