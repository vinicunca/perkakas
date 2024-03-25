import { describe, expect, it } from 'vitest';

import { humanReadableFileSize } from './human-readable-file-size';

describe('humanReadableFileSize', () => {
  it('should format file sizes with base 1024', () => {
    expect(humanReadableFileSize(0, 1024)).toBe('0 B');
    expect(humanReadableFileSize(512, 1024)).toBe('512 B');

    expect(humanReadableFileSize(1024, 1024)).toBe('1.0 KiB');
    expect(humanReadableFileSize(4096, 1024)).toBe('4.0 KiB');

    expect(humanReadableFileSize(1048576, 1024)).toBe('1.0 MiB');
    expect(humanReadableFileSize(2097152, 1024)).toBe('2.0 MiB');

    expect(humanReadableFileSize(1073741824, 1024)).toBe('1.0 GiB');
    expect(humanReadableFileSize(2147483648, 1024)).toBe('2.0 GiB');
  });

  it('should format file sizes with base 1000', () => {
    expect(humanReadableFileSize(0)).toBe('0 B');
    expect(humanReadableFileSize(512)).toBe('512 B');

    expect(humanReadableFileSize(1000)).toBe('1.0 kB');
    expect(humanReadableFileSize(4000)).toBe('4.0 kB');

    expect(humanReadableFileSize(1000000)).toBe('1.0 MB');
    expect(humanReadableFileSize(2000000)).toBe('2.0 MB');

    expect(humanReadableFileSize(1000000000)).toBe('1.0 GB');
    expect(humanReadableFileSize(2000000000)).toBe('2.0 GB');
  });
});
