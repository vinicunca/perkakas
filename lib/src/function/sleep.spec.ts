import { describe, expect, it } from 'vitest';
import { sleep } from './sleep';

describe('sleep', () => {
  it('delay 1s', async () => {
    let dummy = 0;

    expect(dummy).toBe(0);

    await sleep(1000);

    dummy += 1;

    expect(dummy).toBe(1);
  });
});
