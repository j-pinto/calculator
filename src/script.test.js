import { default as dummyFunction } from './script.js';

test('this test should pass', () => {
  expect(dummyFunction()).toBe(1);
});
