import { purry } from '../function/purry';
import { times } from '../function/times';

const ALPHABET
  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 * @param length the length of the random string
 * @returns the random string
 * @signature
 *   P.randomString(length)
 * @example
 *   P.randomString(5) // => aB92J
 *   P.pipe(5, P.randomString) // => aB92J
 * @category String
 * @dataFirst
 */
export function randomString(length: number): string;

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 * @param length the length of the random string
 * @returns the random string
 * @signature
 *   P.randomString()(length)
 * @example
 *    P.pipe(5, P.randomString()) // => aB92J
 * @category String
 * @dataLast
 */
// export function randomString(): (length: number) => string;

export function randomString(...args: any[]): unknown {
  return purry(randomStringImplementation, args);
}

function randomStringImplementation(length: number): string {
  return times(length, randomChar).join('');
}

function randomChar(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)]!;
}