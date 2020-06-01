let numString = "0";

//booleans help track what is or is not a valid next input
let decimalLimit = false;
let isDecimalEntry = false; 
let isOpEntry = false;
let usingPreviousAnswer = false;
let error = false;

let inputArray = []; // contains list of nums and operators to be executed on EQUALS press

let displayString = "0";
document.getElementById("display").innerHTML = displayString;

//array with the operator names, HARD-CODED IN PROPER ORDER OF OPERATIONS
const opNames = ['multiply', 'divide', 'add', 'subtract']

inputAccept(execute);

function inputAccept(callback)
{
    const calcContainer = document.querySelector("#container");
    calcContainer.addEventListener('click', function(e)
    {
        if (numString == "0" && e.target.getAttribute("data-type") == "num")
        {
            isOpEntry = false;
            isDecimalEntry = false;

            numString = e.target.innerHTML; 
            inputArray.length == 0 ? (displayString = numString) : (displayString += numString);
            document.getElementById("display").innerHTML = displayString;
        }
        else if (e.target.getAttribute("data-type") == "num") 
        {
            if (usingPreviousAnswer)
            {
                usingPreviousAnswer = false;
                numString = e.target.innerHTML;
                displayString = numString;
            }
            else
            {
                isOpEntry = false;
                isDecimalEntry = false;
                numString += e.target.innerHTML;
                error ? (displayString = numString) : (displayString += e.target.innerHTML);
                error = false;
            }
            document.getElementById("display").innerHTML = displayString;
        }
        else if (e.target.getAttribute("id") == "decimal" && !decimalLimit)
        {
            isDecimalEntry = true;
            decimalLimit = true;

            if (usingPreviousAnswer)
            {
                usingPreviousAnswer = false;
                numString = ("0" + e.target.innerHTML);
                displayString = numString;
            }
            else
            {
                numString += e.target.innerHTML;
                error ? (displayString = numString) : (displayString += e.target.innerHTML);
                error = false;
            }
            document.getElementById("display").innerHTML = displayString;
        }
        else if (e.target.getAttribute("data-type") == "op" && !isOpEntry && !isDecimalEntry)
        {
            isOpEntry = true;
            isDecimalEntry = false;
            usingPreviousAnswer = false;
            if (error) {displayString = numString;}
            error = false;
            displayString += (" " + e.target.innerHTML + " ");
            document.getElementById("display").innerHTML = displayString;

            inputRecord(e.target.id);
        }
        else if (e.target.getAttribute("id") == "equals" && !isOpEntry && !isDecimalEntry)
        {
            usingPreviousAnswer = false;
            inputRecord();
            callback(); //callback is the execute function
        }
        else if (e.target.getAttribute("id") == "clear")
        {
            clearAll();
        }
        else if(e.target.getAttribute("id") == "delete")
        {
            backspace();
        }
        else if(e.target.getAttribute("id") == "negate" && !isOpEntry && !isDecimalEntry && !error)
        {
            numString = `${-1 * Number(numString)}`
            displayString = numString;
            document.getElementById("display").innerHTML = displayString;
        }
    });
}

function inputRecord(opID)
{
    inputArray.push(Number(numString));

    numString = "0";
    decimalLimit = false;
    isDecimalEntry = false; 

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

function backspace()
{
    usingPreviousAnswer = false;

    if (isOpEntry)
    {
        isOpEntry = false;
        displayString = displayString.slice(0, -3);
        inputArray.pop();

        if (inputArray.length >= 1)
        {
            numString = inputArray.pop();
        }
        else
        {
            numString = "0"
        }
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