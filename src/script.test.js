import { operate, execute } from './script.js';

describe('operate function', () => {
  test('verify basic operations are working', () => {
    expect(operate(1, 2, '+')).toEqual(3);
    expect(operate(3, 4, '-')).toEqual(-1);
    expect(operate(-5, 3, 'x')).toEqual(-15);
    expect(operate(4.2, 2, '/')).toEqual(2.1);
  });

  test('function returns undefined when dividing by zero', () => {
    expect(operate(1, 0, '/')).toEqual(undefined);
  });

  test('formats results to fixed point 8 decimal places w/ correct rounding', () => {
    expect(operate(0.00000001, 0.000000015, '+')).toEqual(0.00000002);
    expect(operate(999999999, 0.000000014, '+')).toEqual(999999999.00000001);
  });

  test('results formatted to exponential notation when above max value', () => {
    expect(operate(999999999.99999999, 0.00000001, '+')).toEqual('1.00e+9');
  });

  test('results formatted to exponential notation when below min value', () => {
    expect(operate(0.00000001, 3, '/')).toEqual('3.33e-9');
  });

  test('returns 1.80e+308, rather than Infinity, when going beyond Number.MAX_VALUE', () => {
    expect(operate(Number.MAX_VALUE, 1, '+')).toEqual('1.80e+308');
    expect(operate(1.7e307, 100, 'x')).toEqual('1.80e+308');
  });

  test('returns 0 when result is less than Number.MIN_VALUE', () => {
    expect(operate(Number.MIN_VALUE, 2, '/')).toEqual(0);
    expect(operate(5e-323, 10, '/')).toEqual(0);
  });
});

describe('execute function', () => {
  test('follows order of operations to get correct answer', () => {
    let numArray = [1, 2, 3, 4, 5];
    let opArray = ['+', 'x', '-', '/'];
    execute(numArray, opArray);
    expect(opArray).toEqual([]);
    expect(numArray).toEqual([6.2]);
  });

  test('breaks early when encountering divide by zero', () => {
    let numArray = [1, 2, 0, 4, 5];
    let opArray = ['+', '/', '-', 'x'];
    execute(numArray, opArray);
    expect(opArray).toEqual(['+', '-', 'x']);
    expect(numArray).toEqual([1, undefined, 4, 5]);
  });
});
