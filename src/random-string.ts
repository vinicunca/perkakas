import { purry } from './purry';
import { times } from './times';

const ALPHABET
  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 *
 * @param length the length of the random string
 * @returns the random string
 * @signature
 *  randomString(length)
 * @example
 *  import { randomString, pipe } from '@vinicunca/perkakas';
 *
 *  randomString(5); // => aB92J
 *  pipe(5, randomString); // => aB92J
 * @category String
 * @dataFirst
 */
export function randomString(length: number): string;

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 *
 * @returns the random string
 * @signature
 *  randomString()(length)
 * @example
 *  import { randomString, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(5, randomString()); // => aB92J
 * @category String
 * @dataLast
 */
// export function randomString(): (length: number) => string;

export function randomString(...args: Array<any>): unknown {
  return purry(randomStringImplementation, args);
}

function randomStringImplementation(length: number): string {
  return times(length, randomChar).join('');
}

function randomChar(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)]!;
}
