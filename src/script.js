import './style.css';

const global = {
  numString: '0',
  opString: '',
  numArray: [],
  opArray: [],
  lastNum: undefined,
  lastOp: undefined,
  error: false,
  isOpEntry: false,
  isDecimalEntry: false,
  isAlreadyDecimal: false,
  usingPreviousAnswer: false,
  usedCE: false,
  alreadyClearedAll: false,
};

const INTEGER_DIGIT_LIMIT = 9;
const DECIMAL_DIGIT_LIMIT = 8;
const RESULT_MIN = 0.00000001;
const RESULT_MAX = 100000000;
const OP_NAMES = ['multiply', 'divide', 'add', 'subtract'];

function operate(num1, num2, operator) {
  let result;
  if (operator === 'add') {
    result = num1 + num2;
  } else if (operator === 'subtract') {
    result = num1 - num2;
  } else if (operator === 'multiply') {
    result = num1 * num2;
  } else if (operator === 'divide') {
    if (num2 === 0) {
      global.error = true;
      return undefined;
    }

    result = num1 / num2;
  }

  if (result < RESULT_MIN || result > RESULT_MAX) {
    result = result.toExponential(2);
  } else {
    result = Number(result.toFixed(8));
  }

  return result;
}
