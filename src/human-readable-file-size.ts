/**
 * Returns human readable file size.
 * @param bytes the file size in bytes
 * @param base the base (1000 or 1024)
 * @signature
 *  humanReadableFileSize(bytes, base)
 * @example
 *  humanReadableFileSize(1000) // => '1.0 kB'
 *  humanReadableFileSize(2097152, 1024) // => '2.0 Mib'
 * @category String
 */
export function humanReadableFileSize(bytes: number, base: 1000 | 1024 = 1000): string {
  if (bytes < base) {
    return `${bytes} B`;
  }

  const prefix = base === 1024 ? ['Ki', 'Mi', 'Gi'] : ['k', 'M', 'G'];
  let unit = -1;

  while (Math.abs(bytes) >= base && unit < prefix.length - 1) {
    bytes /= base;
    ++unit;
  }

  return `${bytes.toFixed(1)} ${prefix[unit]}B`;
}