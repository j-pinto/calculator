import {
  GLOBAL,
  operate,
  execute,
  displayFormat,
  keyboardListener,
  numberInput,
  decimalInput,
  opInput,
  clear,
} from './script.js';

beforeEach(() => {
  GLOBAL.numString = '';
  GLOBAL.numArray = [];
  GLOBAL.opArray = [];
  GLOBAL.error = false;
});

afterEach(() => {
  GLOBAL.numString = '';
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
    GLOBAL.numArray = [1, 2, 3, 4, 5];
    GLOBAL.opArray = ['+', '*', '-', '/'];
    execute();
    expect(GLOBAL.numArray).toEqual([6.2]);
    expect(GLOBAL.opArray).toEqual([]);
  });

  test('breaks early when encountering divide by zero', () => {
    GLOBAL.numArray = [1, 2, 0, 4, 5];
    GLOBAL.opArray = ['+', '/', '-', '*'];
    execute();
    expect(GLOBAL.numArray).toEqual([1, undefined, 4, 5]);
    expect(GLOBAL.opArray).toEqual(['+', '-', '*']);
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

describe('operator input', () => {
  test('allows alternating number and operator inputs', () => {
    numberInput('1');
    opInput('+');
    numberInput('2');
    opInput('*');
    numberInput('3');
    opInput('-');
    expect(GLOBAL.numArray).toEqual([1, 2, 3]);
    expect(GLOBAL.opArray).toEqual(['+', '*', '-']);
  });

  test('uses previous answer as first number if available', () => {
    GLOBAL.numArray = [1, 2, 3, 4, 5];
    GLOBAL.opArray = ['+', '*', '-', '/'];
    execute();
    expect(GLOBAL.numArray).toEqual([6.2]);
    expect(GLOBAL.opArray).toEqual([]);

    opInput('+');
    expect(GLOBAL.numArray).toEqual([6.2]);
    expect(GLOBAL.opArray).toEqual(['+']);
  });

  test('disallows operator input after decimal point', () => {
    numberInput('1');
    numberInput('2');
    numberInput('3');
    decimalInput('.');
    opInput('-');
    expect(GLOBAL.numString).toEqual('123.');
    expect(GLOBAL.opArray).toEqual([]);
  });

  test('switches operator type if two consecutive ops entered', () => {
    numberInput('1');
    numberInput('2');
    numberInput('3');
    opInput('-');
    opInput('+');
    expect(GLOBAL.numArray).toEqual([123]);
    expect(GLOBAL.opArray).toEqual(['+']);
  });

  test('uses 0 as default first num if operator is the first input', () => {
    opInput('+');
    expect(GLOBAL.numArray).toEqual([0]);
    expect(GLOBAL.opArray).toEqual(['+']);
  });
});

describe('clear function', () => {
  test('clears only number being entered', () => {
    GLOBAL.numArray = [123];
    GLOBAL.opArray = ['+'];
    GLOBAL.numString = '456';
    clear();
    expect(GLOBAL.numArray).toEqual([123]);
    expect(GLOBAL.opArray).toEqual(['+']);
    expect(GLOBAL.numString).toEqual('');
  });

  test('clears all if no number being entered', () => {
    GLOBAL.numArray = [123];
    GLOBAL.opArray = ['+'];
    GLOBAL.numString = '';
    clear();
    expect(GLOBAL.numArray).toEqual([]);
    expect(GLOBAL.opArray).toEqual([]);
    expect(GLOBAL.numString).toEqual('');
  });
});

describe('full execution loop, with keyboard listener', () => {
  let event0 = new KeyboardEvent('keydown', { key: '0' });
  let event1 = new KeyboardEvent('keydown', { key: '1' });
  let event2 = new KeyboardEvent('keydown', { key: '2' });
  let event3 = new KeyboardEvent('keydown', { key: '3' });
  let eventDec = new KeyboardEvent('keydown', { key: '.' });
  let eventPlus = new KeyboardEvent('keydown', { key: '+' });
  let eventMinus = new KeyboardEvent('keydown', { key: '-' });
  let eventMul = new KeyboardEvent('keydown', { key: '*' });
  let eventDiv = new KeyboardEvent('keydown', { key: '/' });
  let eventEnter = new KeyboardEvent('keydown', { key: 'Enter' });
  test('simple operation', () => {
    keyboardListener();
    window.dispatchEvent(event1);
    window.dispatchEvent(event2);
    window.dispatchEvent(event3);
    window.dispatchEvent(eventPlus);
    window.dispatchEvent(event1);
    window.dispatchEvent(event2);
    window.dispatchEvent(event3);
    window.dispatchEvent(eventEnter);

    expect(GLOBAL.numArray).toEqual([246]);
  });
});
