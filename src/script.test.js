import {
  GLOBAL,
  operate,
  execute,
  displayFormat,
  keyboardListener,
  numberInput,
  decimalInput,
} from './script.js';

beforeEach(() => {
  GLOBAL.numString = '0';
  GLOBAL.numArray = [];
  GLOBAL.opArray = [];
  GLOBAL.error = false;
});

afterEach(() => {
  GLOBAL.numString = '0';
  GLOBAL.numArray = [];
  GLOBAL.opArray = [];
  GLOBAL.error = false;
});

describe('operate function', () => {
  test('verify basic operations are working', () => {
    expect(operate(1, 2, '+')).toEqual(3);
    expect(operate(3, 4, '-')).toEqual(-1);
    expect(operate(-5, 3, '*')).toEqual(-15);
    expect(operate(4.2, 2, '/')).toEqual(2.1);
  });

  test('function returns undefined if div by 0 or beyond min/max values', () => {
    expect(operate(1, 0, '/')).toEqual(undefined);
    expect(operate(1.7e307, 100, '*')).toEqual(undefined);
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
    let opArray = ['+', '*', '-', '/'];
    let result = execute(numArray, opArray);
    expect(result).toEqual(6.2);
    expect(numArray).toEqual([6.2]);
    expect(opArray).toEqual([]);
  });

  test('breaks early when encountering divide by zero', () => {
    let numArray = [1, 2, 0, 4, 5];
    let opArray = ['+', '/', '-', '*'];
    let result = execute(numArray, opArray);
    expect(result).toEqual(undefined);
    expect(numArray).toEqual([1, undefined, 4, 5]);
    expect(opArray).toEqual(['+', '-', '*']);
  });
});

describe('number input', () => {
  test('basic num input', () => {
    numberInput('1');
    numberInput('2');
    numberInput('3');
    expect(GLOBAL.numString).toEqual('123');
  });

  test('disallows integers over 9 digits long', () => {
    for (let i = 0; i < 9; i++) {
      numberInput('1');
    }
    numberInput('8');
    expect(GLOBAL.numString).toEqual('111111111');
  });
});

describe('decimal input', () => {
  afterEach(() => {
    GLOBAL.numString = '0';
  });

  test('basic decimal input', () => {
    numberInput('1');
    decimalInput('.');
    numberInput('2');
    expect(GLOBAL.numString).toEqual('1.2');
  });

  test('allows 10 characters in numString if decimal', () => {
    for (let i = 0; i < 8; i++) {
      numberInput('1');
    }
    decimalInput('.');
    numberInput('9');
    expect(GLOBAL.numString).toEqual('11111111.9');
  });

  test('disallows second decimal point', () => {
    numberInput('1');
    decimalInput('.');
    numberInput('2');
    decimalInput('.');
    numberInput('3');
    expect(GLOBAL.numString).toEqual('1.23');
  });
});

describe('keyboard listener', () => {
  test('keyboard number input', () => {
    let event1 = new KeyboardEvent('keydown', { key: '1' });
    let event2 = new KeyboardEvent('keydown', { key: '.' });
    keyboardListener();
    window.dispatchEvent(event1);
    window.dispatchEvent(event2);
    for (let i = 0; i < 8; i++) {
      window.dispatchEvent(event1);
    }
    expect(GLOBAL.numString).toEqual('1.11111111');
  });
});
