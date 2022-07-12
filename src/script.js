import './style.css';

const GLOBAL = {
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

const INPUT_DIGIT_LIMIT = 9;
const STD_NOTATION_MIN = 0.000000001;
const STD_NOTATION_MAX = 1000000000;
const OP_NAMES = ['*', '/', '+', '-'];

function operate(num1, num2, operator) {
  let result;
  if (operator === '+') {
    result = num1 + num2;
  } else if (operator === '-') {
    result = num1 - num2;
  } else if (operator === '*') {
    result = num1 * num2;
  } else if (operator === '/') {
    if (num2 === 0) {
      GLOBAL.error = true;
      return undefined;
    }

    result = num1 / num2;
  }

  if (
    Math.abs(result) <= Number.MIN_VALUE ||
    Math.abs(result) >= Number.MAX_VALUE
  ) {
    GLOBAL.error = true;
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
        return numArray[index];
      }
    }
  }
  return numArray[0];
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

function showResult(result) {
  const displayString = `${result}`;
  document.getElementById('display').innerHTML = displayString;
  GLOBAL.opArray = [];
  GLOBAL.isDecimalEntry = false;
  GLOBAL.isAlreadyDecimal = false;
  GLOBAL.usingPreviousAnswer = true;
  GLOBAL.usedCE = true;
}

function numberInput(input) {
  if (
    GLOBAL.numString.includes('.') &&
    GLOBAL.numString.length >= INPUT_DIGIT_LIMIT + 1
  ) {
    return;
  }

  if (
    !GLOBAL.numString.includes('.') &&
    GLOBAL.numString.length >= INPUT_DIGIT_LIMIT
  ) {
    return;
  }

  if (GLOBAL.numString === '0') {
    GLOBAL.numString = input;
  } else {
    GLOBAL.numString += input;
  }
}

function decimalInput(input) {
  if (
    GLOBAL.numString.includes('.') ||
    GLOBAL.numString.length >= INPUT_DIGIT_LIMIT
  ) {
    return;
  }

  GLOBAL.numString += input;
}

function opInput(input) {
  if (GLOBAL.numString.slice(-1) === '.' || GLOBAL.error) {
    return;
  }

  // if using previous answer as input
  if (GLOBAL.numArray.length === 1 && GLOBAL.opArray.length === 0) {
    GLOBAL.numString = '0';
  } else if (GLOBAL.numString !== '0') {
    GLOBAL.numArray.push(Number(GLOBAL.numString));
    GLOBAL.numString = '0';
  }

  // if changing op type
  if (
    GLOBAL.numArray.length === GLOBAL.opArray.length &&
    GLOBAL.opArray.length > 0
  ) {
    GLOBAL.opArray.pop();
  }

  GLOBAL.opArray.push(input);
}

function keyboardListener() {
  window.addEventListener('keydown', (e) => {
    if (Number(e.key) >= 0 && Number(e.key) <= 9) {
      numberInput(e.key);
    } else if (e.key === '.') {
      decimalInput(e.key);
    } else if (
      e.key === '+' ||
      e.key === '-' ||
      e.key === '*' ||
      e.key === '/'
    ) {
      opInput(e.key);
    } else if (e.key === '=' || e.key === 'Enter') {
      // attemptExecute()
    } else if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Escape'
    ) {
      // clear()
    }
  });
}

export {
  GLOBAL,
  operate,
  execute,
  displayFormat,
  showResult,
  keyboardListener,
  numberInput,
  decimalInput,
  opInput,
};
