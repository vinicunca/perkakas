import { randomString } from './random-string';

test('randomString', () => {
  expect(randomString(10).length).toBe(10);
});
