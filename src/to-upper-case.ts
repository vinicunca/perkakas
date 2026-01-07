import { curry } from './curry';

/**
 * Replaces all lowercase characters with their uppercase equivalents.
 *
 * This function is a wrapper around the built-in
 * [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * method and shares its _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase#description)_.
 *
 * For a more linguistically accurate transformation use [`toLocaleUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase),
 * and for display purposes use CSS [`text-transform: uppercase;`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * which *is* locale-aware.
 *
 * For other case manipulations see: `toLowerCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, `toSnakeCase`, and
 * `toTitleCase`.
 *
 * @param data - A string.
 * @signature
 *   P.toUpperCase(data);
 * @example
 *   P.toUpperCase("Hello World"); // "HELLO WORLD"
 * @dataFirst
 * @category String
 */
export function toUpperCase<T extends string>(data: T): Uppercase<T>;

/**
 * Replaces all lowercase characters with their uppercase equivalents.
 *
 * This function is a wrapper around the built-in
 * [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
 * method and shares its _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase#description)_.
 *
 * For a more linguistically accurate transformation use [`toLocaleUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase),
 * and for display purposes use CSS [`text-transform: uppercase;`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
 * which *is* locale-aware.
 *
 * For other case manipulations see: `toLowerCase`, `capitalize`,
 * `uncapitalize`, `toCamelCase`, `toKebabCase`, `toSnakeCase`, and
 * `toTitleCase`.
 *
 * @signature
 *   P.toUpperCase()(data);
 * @example
 *   P.pipe("Hello World", P.toUpperCase()); // "HELLO WORLD"
 * @dataLast
 * @category String
 */
export function toUpperCase(): <T extends string>(data: T) => Uppercase<T>;

export function toUpperCase(...args: ReadonlyArray<unknown>): unknown {
  return curry(toUpperCaseImplementation, args);
}

function toUpperCaseImplementation<T extends string>(data: T): Uppercase<T> {
  // @ts-expect-error [ts2322] -- TypeScript can't infer this from the code...
  return data.toUpperCase();
}
