let numString = "0";
let displayString = "0";
document.getElementById("display").innerHTML = displayString;

// contains list of nums and operators to be executed on "equals" press
let inputArray = [];

//booleans help track what is or is not a valid next input
let decimalLimit = false;
let isDecimalEntry = false; 
let isOpEntry = false;
let usingPreviousAnswer = false;
let error = false;

//array with the operator names, HARD-CODED IN PROPER ORDER OF OPERATIONS
const opNames = ['multiply', 'divide', 'add', 'subtract']

inputAccept(execute);

function inputAccept(callback)
{
    const calcContainer = document.querySelector("#container");
    calcContainer.addEventListener('click', function(e)
    {
        if (e.target.getAttribute("data-type") == "num")
        {
            numberInput(e.target);
        }
        else if (e.target.getAttribute("id") == "decimal" && !decimalLimit)
        {
            decimalInput(e.target);
        }
        else if (e.target.getAttribute("data-type") == "op" && !isOpEntry && !isDecimalEntry)
        {
            operatorInput(e.target, inputRecord);
        }
        else if (e.target.getAttribute("id") == "equals" && !isOpEntry && !isDecimalEntry)
        {
            inputRecord();
            callback(); //callback is the execute function
        }
        else if (e.target.getAttribute("id") == "clear")
        {
            clearAll();
        }
        else if(e.target.getAttribute("id") == "delete" && !error)
        {
            backspace();
        }
        else if(e.target.getAttribute("id") == "negate" && !isOpEntry && !isDecimalEntry && !error)
        {
            negateNum();
        }
    });
}

function numberInput(target)
{
    if (isOpEntry || error || usingPreviousAnswer || numString === "0")
    {
        numString = target.innerHTML;
        console.log("after num input num", numString);
        isOpEntry ? displayString += numString : displayString = numString;
    }
    else
    {
        numString += target.innerHTML;
        console.log("after num input num", numString);
        displayString += target.innerHTML;
    }

    document.getElementById("display").innerHTML = displayString;
    error = false;
    isOpEntry = false;
    isDecimalEntry = false;
    usingPreviousAnswer = false;
}

function decimalInput(target)
{
    isDecimalEntry = true;
    decimalLimit = true;
    isOpEntry = false;

    if (usingPreviousAnswer)
    {
        usingPreviousAnswer = false;
        numString = ("0" + target.innerHTML);
        displayString = numString;
    }
    else
    {
        if (displayString.slice(-1) == " ") 
        {
            console.log("added zero to display");
            displayString += "0"; 
        }

        numString += target.innerHTML;
        console.log("after dec input num", numString);
        error ? (displayString = numString) : (displayString += target.innerHTML);
        error = false;
    }
    document.getElementById("display").innerHTML = displayString;
}

function operatorInput(target, callback)
{
    isOpEntry = true;
    isDecimalEntry = false;
    usingPreviousAnswer = false;
    if (error) {displayString = numString;}
    error = false;
    displayString += (" " + target.innerHTML + " ");
    document.getElementById("display").innerHTML = displayString;

    callback(target.id); //callback function is inputRecord
}

function inputRecord(opID)
{
    inputArray.push(Number(numString));

    numString = "0";
    decimalLimit = false;
    isDecimalEntry = false;
    usingPreviousAnswer = false;

    if (opID)
    {
        inputArray.push(opID);
    }
    else
    {
        isOpEntry = false;
    } 

    return;
}

function execute()
{
    for (let i = 0; i < opNames.length; i++)
    {
        while (inputArray.indexOf(opNames[i]) != -1)
        {
            let index = inputArray.indexOf(opNames[i]);
            let result = operate(inputArray[index - 1], inputArray[index + 1], inputArray[index]);
            if (error)
            {
                return;
            }
            else
            {
                inputArray.splice((index - 1), 3, result);
            }
        }
    }

    displayString = `${inputArray[0]}`;
    document.getElementById("display").innerHTML = displayString;

    numString = `${inputArray[0]}`;
    inputArray = [];

    usingPreviousAnswer = true;
    error = false;
}

function operate(num1, num2, operator)
{
    let result;

    if (operator === 'add')
    {
        result = (num1 + num2);
    }
    else if (operator === 'subtract')
    {
        result = (num1 - num2);
    }
    else if (operator === 'multiply')
    {
        result = (num1 * num2);
    }
    else if(operator === 'divide')
    {
        if (num2 == 0)
        {
            error = true;
            divByZero();
            return;
        }
        else
        {
            result = (num1 / num2);
        }
    }

    return result;
}

function negateNum()
{
    let match = displayString.search(`${numString}`);
    displayString = displayString.slice(0, match);

    numString = `${-1 * Number(numString)}`
    displayString += numString;
    document.getElementById("display").innerHTML = displayString;
}

function backspace()
{
    usingPreviousAnswer = false;

    if (isOpEntry)
    {
        isOpEntry = false;
        inputArray.pop();

        if (inputArray.length >= 1)
        {
            numString = inputArray.pop();
        }
        else
        {
            numString = "0"
        }

        displayString = displayString.slice(0, -3);
        document.getElementById("display").innerHTML = displayString;
    }
    else if (displayString.length == 1)
    {
        numString = "0";
        displayString = "0";
        document.getElementById("display").innerHTML = displayString;
    }
    else 
    {
        numString = numString.slice(0, -1);
        displayString = displayString.slice(0, -1);
        document.getElementById("display").innerHTML = displayString;

        if (displayString.slice(-1) == ".")
        {
            isDecimalEntry = true;
            decimalLimit = true;
        }
        else if (displayString.slice(-1) == " ")
        {
            isOpEntry = true;
        }
    }
}

function clearAll()
{
    numString = "0";
    inputArray = [];

    decimalLimit = false;
    isDecimalEntry = false;
    isOpEntry = false;
    usingPreviousAnswer = false;

    displayString = "0";
    document.getElementById("display").innerHTML = displayString;

    return;
}

function divByZero()
{
    displayString = "ERROR: divide by zero";
    document.getElementById("display").innerHTML = displayString;
    numString = "0";
    inputArray = [];

    decimalLimit = false;
    isDecimalEntry = false;
    isOpEntry = false;
    usingPreviousAnswer = false;

    return;
}