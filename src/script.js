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

const INTEGER_INPUT_LIMIT = 9;
const DECIMAL_INPUT_LIMIT = 8;
const FIXED_POINT_MIN = 0.00000001;
const FIXED_POINT_MAX = 1000000000;
const OP_NAMES = ['x', '/', '+', '-'];

function operate(num1, num2, operator) {
  let result;
  if (operator === '+') {
    result = num1 + num2;
  } else if (operator === '-') {
    result = num1 - num2;
  } else if (operator === 'x') {
    result = num1 * num2;
  } else if (operator === '/') {
    if (num2 === 0) {
      global.error = true;
      return undefined;
    }

    result = num1 / num2;
  }

  // keep results in fixed point or move to exponential notaion if too large/small
  if (
    Math.abs(result) < FIXED_POINT_MIN ||
    Math.abs(result) >= FIXED_POINT_MAX
  ) {
    result = result.toExponential(2);
  } else {
    result = Number(result.toFixed(8));
  }

  // handle Max and Min allowed values in exponential notation
  if (Math.abs(result) <= Number.MIN_VALUE) {
    result = 0;
  }

  if (Math.abs(result) >= Number.MAX_VALUE) {
    result = (Math.sign(result) * Number.MAX_VALUE).toExponential(2);
  }

  return result;
}

export { operate };
