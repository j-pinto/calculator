let numString = '0';
let opString = '';
document.getElementById('display').innerHTML = numString;

// lists of nums and operators to be executed on "equals" press
let numArray = [];
let opArray = [];

// use when "equals" is pressed immediately after an executing an operation
let lastNum;
let lastOp;

// bools and consts help track what is or is not a valid next input
let error = false;
let isOpEntry = false;
let isDecimalEntry = false;
let isAlreadyDecimal = false;
let usingPreviousAnswer = false;
let usedCE = false;
let alreadyClearedAll = false;

const integerDigitLimit = 9;
const decimalDigitLimit = 8;

// array with the operator names, IN PROPER ORDER OF OPERATIONS
const opNames = ['multiply', 'divide', 'add', 'subtract'];

// for result formatting
const resultMin = 0.00000001;
const resultMax = 100000000;

mouseListen(execute);
keyboardListen(execute);

function keyboardListen(callback) {
  window.addEventListener('keydown', (e) => {
    if (Number(e.key) >= 0 && Number(e.key) <= 9) {
      numberInput(e);
      highlightRemove();
      flash(e);
    } else if (e.key == '.' && !isAlreadyDecimal) {
      decimalInput(e);
      highlightRemove();
      flash(e);
    } else if (
      (e.key == '+' || e.key == '-' || e.key == '*' || e.key == '/') &&
      !isDecimalEntry &&
      !error
    ) {
      if (isOpEntry) {
        operatorInput(e);
      } else {
        operatorInput(e);
        if (!usingPreviousAnswer) {
          numberRecord();
        }
      }

      highlightRemove();
      highlight(e);
    } else if (
      (e.key == '=' || e.key == 'Enter') &&
      !isOpEntry &&
      !isDecimalEntry
    ) {
      if (usingPreviousAnswer) {
        repeatLast(execute);
      } else {
        operatorRecord();
        numberRecord();
        callback(); // callback is the execute function
      }

      highlightRemove();
      flash(e);
    } else if (e.key == 'Backspace' || e.key == 'Delete' || e.key == 'Escape') {
      if (usedCE) {
        clearAll();
      } else {
        clearEntry();
      }

      highlightRemove();
      flash(e);
    }

    if (usedCE) {
      document.getElementById('clear').innerHTML = 'AC';
    } else {
      document.getElementById('clear').innerHTML = 'C';
    }
  });
}

function mouseListen(callback) {
  const calcContainer = document.querySelector('#container');
  calcContainer.addEventListener('click', (e) => {
    if (e.target.getAttribute('data-type') == 'num') {
      numberInput(e.target);
      highlightRemove();
      flash(e.target);
    } else if (e.target.getAttribute('id') == 'decimal' && !isAlreadyDecimal) {
      decimalInput(e.target);
      highlightRemove();
      flash(e.target);
    } else if (
      e.target.getAttribute('data-type') == 'op' &&
      !isDecimalEntry &&
      !error
    ) {
      if (isOpEntry) {
        operatorInput(e.target);
      } else {
        operatorInput(e.target);
        if (!usingPreviousAnswer) {
          numberRecord();
        }
      }
      highlightRemove();
      highlight(e.target);
    } else if (
      e.target.getAttribute('id') == 'equals' &&
      !isOpEntry &&
      !isDecimalEntry
    ) {
      if (usingPreviousAnswer) {
        repeatLast(execute);
      } else {
        operatorRecord();
        numberRecord();
        highlightRemove();
        flash(e.target);
        callback(); // callback is the execute function
      }
    } else if (e.target.getAttribute('id') == 'clear') {
      if (usedCE) {
        clearAll();
      } else {
        clearEntry();
      }

      highlightRemove();
      flash(e.target);
    } else if (
      e.target.getAttribute('id') == 'negate' &&
      !isOpEntry &&
      !isDecimalEntry &&
      !error
    ) {
      negateNum();
      flash(e.target);
    } else if (
      e.target.getAttribute('id') == 'percent' &&
      !isOpEntry &&
      !isDecimalEntry &&
      !error
    ) {
      percent();
      flash(e.target);
    }

    if (usedCE || alreadyClearedAll) {
      document.getElementById('clear').innerHTML = 'AC';
    } else {
      document.getElementById('clear').innerHTML = 'C';
    }
  });
}

function numberInput(target) {
  if (isAlreadyDecimal) {
    const decimalPosition = numString.indexOf('.');
    const decimalLength = numString.slice(decimalPosition + 1).length;
    if (decimalLength >= decimalDigitLimit) {
      return;
    }
  } else if (numString.length >= integerDigitLimit) {
    return;
  }

  if (isOpEntry) {
    operatorRecord();
    if (target.key) {
      numString = target.key;
    } else {
      numString = target.innerHTML;
    }
  } else if (usingPreviousAnswer || numString == '0') {
    if (target.key) {
      numString = target.key;
    } else {
      numString = target.innerHTML;
    }
  } else if (target.key) {
    numString += target.key;
  } else {
    numString += target.innerHTML;
  }

  document.getElementById('display').innerHTML = numString;
  error = false;
  isOpEntry = false;
  isDecimalEntry = false;
  usingPreviousAnswer = false;
  usedCE = false;
}

function decimalInput(target) {
  if (usingPreviousAnswer || isOpEntry || error) {
    if (target.key) {
      numString = `0${target.key}`;
    } else {
      numString = `0${target.innerHTML}`;
    }
  } else if (target.key) {
    numString += target.key;
  } else {
    numString += target.innerHTML;
  }

  document.getElementById('display').innerHTML = numString;
  error = false;
  isOpEntry = false;
  isDecimalEntry = true;
  isAlreadyDecimal = true;
  usingPreviousAnswer = false;
  usedCE = false;
}

function operatorInput(target) {
  if (target.key) {
    if (target.key == '+') {
      opString = 'add';
    }
    if (target.key == '-') {
      opString = 'subtract';
    }
    if (target.key == '*') {
      opString = 'multiply';
    }
    if (target.key == '/') {
      opString = 'divide';
    }
  } else {
    opString = target.id;
  }
  isOpEntry = true;
  isDecimalEntry = false;
  usedCE = false;
}

function numberRecord() {
  numArray.push(Number(numString));
  numString = '0';
  isAlreadyDecimal = false;
  isDecimalEntry = false;
  usedCE = false;
}

function operatorRecord() {
  if (opString == '') {
    return;
  }
  opArray.push(opString);
  opString = '';
  isAlreadyDecimal = false;
  isDecimalEntry = false;
  usedCE = false;
}

function execute() {
  lastNum = numArray[numArray.length - 1];

  for (let i = 0; i < opNames.length; i++) {
    while (opArray.indexOf(opNames[i]) != -1) {
      const index = opArray.indexOf(opNames[i]);
      const result = operate(
        numArray[index],
        numArray[index + 1],
        opArray[index]
      );

      if (error) {
        return;
      }

      opArray.splice(index, 1);
      numArray.splice(index, 2, result);
    }
  }

  opArray = [];
  numString = `${numArray[0]}`;
  document.getElementById('display').innerHTML = numString;

  isDecimalEntry = false;
  isAlreadyDecimal = false;
  usingPreviousAnswer = true;
  usedCE = true;
}

function operate(num1, num2, operator) {
  let result;
  if (operator === 'add') {
    result = num1 + num2;
  } else if (operator === 'subtract') {
    result = num1 - num2;
  } else if (operator === 'multiply') {
    result = num1 * num2;
  } else if (operator === 'divide') {
    if (num2 == 0) {
      error = true;
      divByZero();
      return;
    }

    result = num1 / num2;
  }

  if (result < resultMin || result > resultMax) {
    result = result.toExponential(2);
  } else {
    result = Number(result.toFixed(8));
  }

  return result;
}

function divByZero() {
  document.getElementById('display').innerHTML = 'ERROR: divide by zero';
  numString = '0';
  numArray = [];
  opArray = [];

  error = true;
  isOpEntry = false;
  isDecimalEntry = false;
  isAlreadyDecimal = false;
  usingPreviousAnswer = false;
}

function clearEntry() {
  if (isOpEntry) {
    opString = '';
    isOpEntry = false;
  } else if (usingPreviousAnswer) {
    clearAll();
    return;
  } else {
    numString = '0';
    document.getElementById('display').innerHTML = numString;
  }

  isDecimalEntry = false;
  isAlreadyDecimal = false;
  usedCE = true;
  alreadyClearedAll = false;
}

function clearAll() {
  numString = '0';
  numArray = [];
  opArray = [];
  document.getElementById('display').innerHTML = numString;

  error = false;
  isOpEntry = false;
  isDecimalEntry = false;
  isAlreadyDecimal = false;
  usingPreviousAnswer = false;
  usedCE = false;
  alreadyClearedAll = true;
}

function repeatLast(callback) {
  numArray.push(lastNum);
  opArray.push(lastOp);
  callback();
}

function negateNum() {
  if (usingPreviousAnswer) {
    numArray.pop();
    usingPreviousAnswer = false;
  }

  numString = `${-1 * Number(numString)}`;
  document.getElementById('display').innerHTML = numString;

  error = false;
  isOpEntry = false;
  usingPreviousAnswer = false;
  usedCE = false;
}

function percent() {
  if (usingPreviousAnswer) {
    numArray.pop();
    usingPreviousAnswer = false;
  }

  numString /= 100;
  document.getElementById('display').innerHTML = numString;

  error = false;
  isOpEntry = false;
  isDecimalEntry = false;
  usingPreviousAnswer = false;
  usedCE = false;
}

function flash(target) {
  if (target.key) {
    target = document.getElementsByClassName(`${target.key}`);
    target[0].classList.add('flash');
    setTimeout(() => {
      target[0].classList.remove('flash');
    }, 300);
  } else {
    target.classList.add('flash');
    setTimeout(() => {
      target.classList.remove('flash');
    }, 300);
  }
}

function highlight(target) {
  if (target.key) {
    target = document.getElementsByClassName(`${target.key}`);
    target[0].classList.add('highlight');
  } else {
    target.classList.add('highlight');
  }
}

function highlightRemove() {
  const highlighted = Array.from(document.querySelectorAll('.highlight'));
  highlighted.forEach((element) => {
    element.classList.remove('highlight');
  });
}
