import { curry } from './curry';

const ALPHABET
  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 *
 * @param length - The length of the random string.
 * @returns The random string.
 * @signature
 *   P.randomString(length)
 * @example
 *   P.randomString(5) // => aB92J
 * @dataFirst
 * @category String
 */
export function randomString(length: number): string;

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 *
 * @returns The random string.
 * @signature
 *   P.randomString()(length)
 * @example
 *   P.pipe(5, P.randomString()) // => aB92J
 * @dataLast
 * @category String
 */
export function randomString(): (length: number) => string;

export function randomString(...args: ReadonlyArray<unknown>): unknown {
  return curry(randomStringImplementation, args);
}

function randomStringImplementation(length: number): string {
  const out: Array<string> = [];
  for (let iteration = 0; iteration < length; iteration++) {
    const randomChar = ALPHABET[Math.floor(Math.random() * ALPHABET.length)]!;
    out.push(randomChar);
  }
  return out.join('');
}
