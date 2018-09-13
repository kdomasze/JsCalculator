const isNumeric = (num) => !Number.isNaN(num) && !Number.isNaN(parseFloat(num));

const _seperateOutHighOrderOperations = (expression) => {
    const calculation = [];
    let temp = '';

    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === '+' || expression[i] === '-') {
            calculation.push(temp);
            temp = '';
            calculation.push(expression[i]);
        } else {
            temp += expression[i];
        }

        if (Number(i) === expression.length - 1) {
            calculation.push(temp);
        }
    }

    return calculation;
};

const _handleOperator = (operator, num, result) => {
    let newResult = result;

    switch (operator) {
        case '-':
            newResult = result - num;
            break;
        case '×':
            newResult = result * num;
            break;
        case '÷':
            newResult = result / num;
            break;
        case '+':
        default:
            newResult = result + num;
    }

    return newResult;
};

// this function will calculate all the multiplication and division expression and return
// an array of numbers and operators (bound to '+' and '-')
const _calculateLowerOrderExpression = (higherOrderExpression) => {
    const lowerOrderExpression = [];

    for (let i = 0; i < higherOrderExpression.length; i++) {
        // we just want to store and move on if the operation isn't multiplication
        // or division
        if (higherOrderExpression[i].includes('+') || higherOrderExpression[i].includes('-')) {
            lowerOrderExpression.push(higherOrderExpression[i]);
        } else {
            let operator = '';

            // figure out if we are multiplying or dividing
            if (higherOrderExpression[i].includes('×')) {
                operator = '×';
            } else {
                operator = '÷';
            }

            const splitOperation = higherOrderExpression[i].split(operator);
            let tempResult = splitOperation[0];
            // loop through each number in the current operation and ensure they are all
            // multiplied or divided together
            for (let j = 1; j < splitOperation.length; j++) {
                tempResult = _handleOperator(operator, splitOperation[j], tempResult);
            }
            lowerOrderExpression.push(`${tempResult}`);
        }
    }

    return lowerOrderExpression;
};

const _calculateResult = (lowerOrderExpression) => {
    let result = 0;
    let lastOperator = '+';
    for (let i = 0; i < lowerOrderExpression.length; i++) {
        if (isNumeric(lowerOrderExpression[i])) {
            result = _handleOperator(lastOperator, Number(lowerOrderExpression[i]), result);
        } else {
            lastOperator = lowerOrderExpression[i];
        }
    }

    return result;
};

const _parseExpression = (joinedExpression) => {
    const higherOrderExpression = _seperateOutHighOrderOperations(joinedExpression);
    const lowerOrderExpression = _calculateLowerOrderExpression(higherOrderExpression);
    const result = _calculateResult(lowerOrderExpression);
    return result;
};

const deleteEntry = (entry, output) => {
    let updatedEntry = entry;

    if (updatedEntry.length === 0) {
        return updatedEntry;
    }

    // delete character
    updatedEntry = updatedEntry.substring(0, updatedEntry.length - 1);

    // deleting results in empty output case
    if (updatedEntry.length === 0) {
        output.text('0');
        return updatedEntry;
    }

    // display output
    output.text(updatedEntry);

    return updatedEntry;
};

const addOperator = (entry, buttonText, output) => {
    let updatedEntry = entry;

    updatedEntry += buttonText;
    output.text(updatedEntry);

    return updatedEntry;
};

const addDecimal = (entry, output) => {
    let updatedEntry = entry;

    const tempSplit = entry.split(/[+-÷×]/);
    if (!tempSplit[tempSplit.length - 1].includes('.')) {
        updatedEntry += '.';
    }
    output.text(updatedEntry);

    return updatedEntry;
};

const addNumber = (entry, buttonText, output) => {
    let updatedEntry = entry;

    updatedEntry += buttonText;
    output.text(updatedEntry);

    return updatedEntry;
};

const calculateResult = (entry, output) => {
    let updatedEntry = entry;

    const result = _parseExpression(updatedEntry);

    updatedEntry = `${result}`;
    output.text(updatedEntry);

    return updatedEntry;
};

$(document).ready(() => {
    let entry = '';

    const $output = $('.output');

    // blinking cursor for output
    setInterval(() => {
        $('.output').toggleClass('blinking-cursor');
    }, 500);

    // button effects for numbers
    $('.num-area').hover((event) => {
        if (!$(event.currentTarget).hasClass('empty')) {
            $(event.currentTarget).toggleClass('num-area-active');
        }
    });

    // button effects for operators
    $('.operator-area').hover((event) => {
        if (!$(event.currentTarget).hasClass('empty')) {
            $(event.currentTarget).toggleClass('operator-area-active');
        }
    });

    // button logic
    $('.button').on('click', (event) => {
        if (!$(event.currentTarget).hasClass('empty')) {
            const buttonText = $(event.currentTarget).text();

            if (
                buttonText === '÷' ||
                buttonText === '×' ||
                buttonText === '-' ||
                buttonText === '+'
            ) {
                entry = addOperator(entry, buttonText, $output);
            } else if (buttonText === '.') {
                entry = addDecimal(entry, $output);
            } else if (buttonText === 'DEL') {
                entry = deleteEntry(entry, $output);
            } else if (buttonText === '=') {
                entry = calculateResult(entry, $output);
            } else {
                entry = addNumber(entry, buttonText, $output);
            }
        }
    });
});
