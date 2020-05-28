function operate(num1, num2, operator)
{
    let result;

    if (operator === 'add')
    {
        result = add(num1, num2);
    }
    else if (operator === 'subtract')
    {
        result = subtract(num1, num2);
    }
    else if (operator === 'multiply')
    {
        result = multiply(num1, num2);
    }
    else if(operator === 'divide')
    {
        result = divide(num1, num2);
    }

    console.log(result);
    return result;
}

function add(x,y)
{
    return (x + y);
}

function subtract(x,y)
{
    return (x - y);
}

function multiply(x,y)
{
    return (x * y);
}

function divide(x,y)
{
    return (x / y);
}