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
const STD_NOTATION_MIN = 0.000000001;
const STD_NOTATION_MAX = 1000000000;
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

  if (
    Math.abs(result) <= Number.MIN_VALUE ||
    Math.abs(result) >= Number.MAX_VALUE
  ) {
    global.error = true;
    result = undefined;
  }

  return result;
}

function execute(numArray, opArray) {
  for (let offset = 0; offset <= 2; offset += 2) {
    const op1 = OP_NAMES[0 + offset];
    const op2 = OP_NAMES[1 + offset];
    while (opArray.some((op) => op === op1 || op === op2)) {
      const index = opArray.findIndex((op) => op === op1 || op === op2);
      const operator = opArray[index];
      const num1 = numArray[index];
      const num2 = numArray[index + 1];
      const result = operate(num1, num2, operator);
      opArray.splice(index, 1);
      numArray.splice(index, 2, result);
      if (result === undefined) {
        return;
      }
    }
  }
}

function displayFormat(result) {
  let formattedResultString;
  if (result === undefined) {
    formattedResultString = 'Error';
  } else if (result >= STD_NOTATION_MAX || result < STD_NOTATION_MIN) {
    formattedResultString = parseFloat(result.toPrecision(9)).toExponential(2);
  } else {
    formattedResultString = parseFloat(result.toPrecision(9));
  }

  return formattedResultString;
}

export { operate, execute, displayFormat };
