import { operate, execute, displayFormat } from './script.js';

describe('operate function', () => {
  test('verify basic operations are working', () => {
    expect(operate(1, 2, '+')).toEqual(3);
    expect(operate(3, 4, '-')).toEqual(-1);
    expect(operate(-5, 3, 'x')).toEqual(-15);
    expect(operate(4.2, 2, '/')).toEqual(2.1);
  });

  test('function returns undefined if div by 0 or beyond min/max values', () => {
    expect(operate(1, 0, '/')).toEqual(undefined);
    expect(operate(1.7e307, 100, 'x')).toEqual(undefined);
    expect(operate(5e-323, 10, '/')).toEqual(undefined);
  });
});

describe('displayFormat function', () => {
  test('formats results to 9 digits of precision', () => {
    expect(displayFormat(123456789.1)).toEqual(123456789);
  });

  test('formats very large and very small numbers to exponential', () => {
    expect(displayFormat(1234567890)).toEqual('1.23e+9');
    expect(displayFormat(0.00000000099999999)).toEqual('1.00e-9');
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
