import { operate } from './script.js';

test('verify basic operations are working', () => {
  expect(operate(1, 2, '+')).toEqual(3);
  expect(operate(3, 4, '-')).toEqual(-1);
  expect(operate(-5, 3, 'x')).toEqual(-15);
  expect(operate(4.2, 2, '/')).toEqual(2.1);
});

test('operate function returns undefined when dividing by zero', () => {
  expect(operate(1, 0, '/')).toEqual(undefined);
});

test('operate formats results to fixed point 8 decimal places w/ correct rounding', () => {
  expect(operate(0.00000001, 0.000000015, '+')).toEqual(0.00000002);
  expect(operate(999999999, 0.000000014, '+')).toEqual(999999999.00000001);
});

test('operate results formatted to exponential notation when above max value', () => {
  expect(operate(999999999.99999999, 0.00000001, '+')).toEqual('1.00e+9');
});

test('operate results formatted to exponential notation when below min value', () => {
  expect(operate(0.00000001, 3, '/')).toEqual('3.33e-9');
});

test('operate returns 1.80e+308, rather than Infinity, when going beyond Number.MAX_VALUE', () => {
  expect(operate(Number.MAX_VALUE, 1, '+')).toEqual('1.80e+308');
  expect(operate(1.7e307, 100, 'x')).toEqual('1.80e+308');
});

test('operate returns 0 when result is less than Number.MIN_VALUE', () => {
  expect(operate(Number.MIN_VALUE, 2, '/')).toEqual(0);
  expect(operate(5e-323, 10, '/')).toEqual(0);
});
