import { randomString } from './random-string';

it('randomString', () => {
  expect(randomString(10).length).toBe(10);
});
