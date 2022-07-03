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
