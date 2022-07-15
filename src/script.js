import './style.css';

const GLOBAL = {
  numString: '',
  numArray: [],
  opArray: [],
  error: false,
};

const INPUT_DIGIT_LIMIT = 9;
const STD_NOTATION_MIN = 0.000000001;
const STD_NOTATION_MAX = 1000000000;

function operate(num1, num2, operator) {
  let result;
  if (operator === '+') {
    result = num1 + num2;
  } else if (operator === '-') {
    console.log(num1, num2, operator);
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
    (result !== 0 && Math.abs(result) <= Number.MIN_VALUE) ||
    Math.abs(result) >= Number.MAX_VALUE
  ) {
    GLOBAL.error = true;
    result = undefined;
  }

  return result;
}

function execute() {
  while (GLOBAL.opArray.some((op) => op === '*' || op === '/')) {
    const index = GLOBAL.opArray.findIndex((op) => op === '*' || op === '/');
    const operator = GLOBAL.opArray[index];
    const num1 = GLOBAL.numArray[index];
    const num2 = GLOBAL.numArray[index + 1];
    const result = operate(num1, num2, operator);
    GLOBAL.opArray.splice(index, 1);
    GLOBAL.numArray.splice(index, 2, result);
    if (result === undefined) {
      return;
    }
  }

  while (GLOBAL.opArray.some((op) => op === '+' || op === '-')) {
    const index = GLOBAL.opArray.findIndex((op) => op === '+' || op === '-');
    const operator = GLOBAL.opArray[index];
    const num1 = GLOBAL.numArray[index];
    const num2 = GLOBAL.numArray[index + 1];
    console.log(num1, num2, operator);
    const result = operate(num1, num2, operator);
    console.log(result);
    GLOBAL.opArray.splice(index, 1);
    GLOBAL.numArray.splice(index, 2, result);
    if (result === undefined) {
      return;
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

function showResult(result) {
  const displayString = `${result}`;
  document.getElementById('display').innerHTML = displayString;
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

  if (GLOBAL.numString === '0' || GLOBAL.numString === '') {
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

function numberRecord() {
  // uses previous answer if op entered directly after execute
  if (GLOBAL.numArray.length === 1 && GLOBAL.opArray.length === 0) {
    GLOBAL.numString = '';
    // uses zero as default number when op entry before any number entered
  } else if (GLOBAL.numString === '' && GLOBAL.opArray.length === 0) {
    GLOBAL.numArray.push(0);
    // standard number record
  } else if (GLOBAL.numString !== '') {
    console.log(GLOBAL.numString);
    GLOBAL.numArray.push(Number(GLOBAL.numString));
    GLOBAL.numString = '';
  }
}

function opInput(input) {
  if (GLOBAL.numString.slice(-1) === '.' || GLOBAL.error) {
    return;
  }

  numberRecord();

  // if changing op type
  if (
    GLOBAL.numArray.length === GLOBAL.opArray.length &&
    GLOBAL.opArray.length > 0
  ) {
    GLOBAL.opArray.pop();
  }
  console.log(input);
  GLOBAL.opArray.push(input);
}

function attemptExecute() {
  if (
    GLOBAL.numArray.length === GLOBAL.opArray.length &&
    GLOBAL.opArray.length >= 1
  ) {
    numberRecord();
    execute();
  }
}

function clear() {
  // clear all
  if (GLOBAL.numString === '') {
    GLOBAL.numArray = [];
    GLOBAL.opArray = [];
  }

  // clear entry
  GLOBAL.numString = '';
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
      attemptExecute();
    } else if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Escape'
    ) {
      clear();
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
  clear,
};
