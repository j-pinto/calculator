let numString = "0"; //numString always resets back to "0"

//these help track what is or is not a valid next input
//for example we dont want to allow two operators or two decimal points consecutively
//dont want to be able to press EQUALS right after operator or decimal point
let decimalLimit = false;
let isDecimalEntry = false; 
let isOpEntry = false;
let usingPreviousAnswer = false;
let error = false;

let inputArray = []; // contains list of nums and operators to be executed on EQUALS press

let displayString = "0"; //only resets to "0" after CLEAR press, otherwise shows Ans from previous execution
document.getElementById("display").innerHTML = displayString;

//array with the operator names, HARD-CODED IN PROPER ORDER OF OPERATIONS
const opNames = ['multiply', 'divide', 'add', 'subtract']

inputAccept(execute);

function inputAccept(callback) //TODO: add callback, add displayString manipulation
{
    const calcContainer = document.querySelector("#container");
    calcContainer.addEventListener('click', function(e)
    {
        if (numString == "0" && e.target.getAttribute("data-type") == "num") //what to do if starting new num input
        {
            isOpEntry = false;
            isDecimalEntry = false;

            numString = e.target.innerHTML; //existing zero gets replaced on first num input, dont allow multiple 0's w/o decimal
            inputArray.length == 0 ? (displayString = numString) : (displayString += numString);
            document.getElementById("display").innerHTML = displayString;
        }
        else if (e.target.getAttribute("data-type") == "num") //concatenate num inputs until op or equals is pressed  
        {
            if (usingPreviousAnswer)//if entering num after Ans is returned, discard Ans
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
        else if (e.target.getAttribute("id") == "decimal" && !decimalLimit) //dont allow multiple decimal points in a number
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
        else if (e.target.getAttribute("data-type") == "op" && !isOpEntry && !isDecimalEntry) //only allow one op entry before next number
        {
            isOpEntry = true;
            isDecimalEntry = false;
            usingPreviousAnswer = false;
            if (error) {displayString = numString;}
            error = false;
            displayString += (" " + e.target.innerHTML + " "); //display ops with suurounding spaces
            document.getElementById("display").innerHTML = displayString;

            inputRecord(e.target.id);
        }
        else if (e.target.getAttribute("id") == "equals" && !isOpEntry && !isDecimalEntry) //dont allow EQUALS right after op or decimal point
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
            //TODO: delete function
        }
        else if(e.target.getAttribute("id") == "negate")
        {
            //TODO: negate function
        }

        //console.log("inputAccept | numString", numString);
        //console.log("inputAccept | displayString", displayString);
        //console.log("inputAccept | inputArray", inputArray);
        //console.log("inputAccept | numString", numString);
        //console.log("inputAccept | decimalLimit", decimalLimit);
        //console.log("inputAccept | isDecimalEntry", isDecimalEntry);
        //console.log("inputAccept | isOpEntry", isOpEntry);
        //console.log("inputAccept | usingPreviousAnswer", usingPreviousAnswer); 
    });
}

function inputRecord(opID)
{
    //console.log("inputRecord | numString at start", numString);
    inputArray.push(Number(numString));

    numString = "0";
    decimalLimit = false;
    isDecimalEntry = false; 

    if (opID) //do not reset isOpEntry unless triggered by EQUALS press
    {
        inputArray.push(opID);
    }
    else
    {
        isOpEntry = false;
    } 
    //console.log("inputRecord | numString at finish", numString);
    //console.log("inputRecord | displayString", displayString);
    //console.log("inputRecord | inputArray", inputArray);
    //console.log("inputRecord | numString", numString);
    //console.log("inputRecord | decimalLimit", decimalLimit);
    //console.log("inputRecord | isDecimalEntry", isDecimalEntry);
    //console.log("inputRecord | isOpEntry", isOpEntry);
    //console.log("inputRecord | usingPreviousAnswer", usingPreviousAnswer); 

    return;
}

function execute()
{
    //loop through opNames, execute every op of that type from inputArray, move to next opName
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

    //console.log("execute | numString", numString);
    //console.log("execute | displayString", displayString);
    //console.log("execute | inputArray", inputArray);
    //console.log("execute | numString", numString);
    //console.log("execute | decimalLimit", decimalLimit);
    //console.log("execute | isDecimalEntry", isDecimalEntry);
    //console.log("execute | isOpEntry", isOpEntry);
    //console.log("execute | usingPreviousAnswer", usingPreviousAnswer); 
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

    //console.log("operate function", result);
    return result;
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

    //console.log("clearAll | numString", numString);
    //console.log("clearAll | displayString", displayString);
    //console.log("clearAll | inputArray", inputArray);
    //console.log("clearAll | numString", numString);
    //console.log("clearAll | decimalLimit", decimalLimit);
    //console.log("clearAll | isDecimalEntry", isDecimalEntry);
    //console.log("clearAll | isOpEntry", isOpEntry);
    //console.log("clearAll | usingPreviousAnswer", usingPreviousAnswer);

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