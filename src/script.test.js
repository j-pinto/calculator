import { operate } from './script.js';

test('verify basic operations are working', () => {
  expect(operate(1, 2, '+')).toEqual(3);
  expect(operate(3, 4, '-')).toEqual(-1);
  expect(operate(-5, 3, 'x')).toEqual(-15);
  expect(operate(4.2, 2, '/')).toEqual(2.1);
});
