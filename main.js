/**
 * Checks if a string is a valid numeric representation
 * @param {string} num the string representation to check if it is a number
 */
const _isNumeric = (num) => !Number.isNaN(num) && !Number.isNaN(parseFloat(num));

/**
 * Seperates out the high order operations (multiplication and division) into their
 * own index in an array. This allows their result to be parsed seperately from the
 * lower order operations (subtraction and addition) in order to obay order of
 * operations.
 * @param {string} expression The string containing the current calculator string
 */
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

/**
 * Performs and returns the result of the operation (result (operator) num). I.E. (result + num).
 * @param {string} operator The string representation of the operator to be applied
 * @param {number} num The number to be applied to the result
 * @param {number} result The current result that will have the num applied to it
 */
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

/**
 * Calculates all the multiplication and division expression and return
 * an array of numbers and operators (bound to '+' and '-')
 * @param {Array<string>} higherOrderExpression The output of _seperateOutHighOrderOperations
 */
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

/**
 * Calculates all the addition and subtraction expressions and returns the final result
 * @param {Array<any>} lowerOrderExpression The output of _calculateLowerOrderExpression
 */
const _calculateResult = (lowerOrderExpression) => {
    let result = 0;
    let lastOperator = '+';
    for (let i = 0; i < lowerOrderExpression.length; i++) {
        if (_isNumeric(lowerOrderExpression[i])) {
            result = _handleOperator(lastOperator, Number(lowerOrderExpression[i]), result);
        } else {
            lastOperator = lowerOrderExpression[i];
        }
    }

    return result;
};

/**
 * Parses the calculation of the current calculator string and returns the result
 * @param {string} entry The string containing the current calculator string
 */
const _parseExpression = (entry) => {
    const higherOrderExpression = _seperateOutHighOrderOperations(entry);
    const lowerOrderExpression = _calculateLowerOrderExpression(higherOrderExpression);
    const result = _calculateResult(lowerOrderExpression);
    return result;
};

/**
 * Checks if the passed in character is a valid operator
 * @param {string} character Character to check
 */
const isOperator = (character) =>
    character === '÷' || character === '×' || character === '-' || character === '+';

/**
 * Checks if the passed in string ends with a valid operator
 * @param {string} string The string to check
 */
const _endsWithOperator = (string) => {
    const lastIndex = string.length - 1;
    return isOperator(string[lastIndex]);
};

/**
 * Deletes a single character from the current calculator string
 * @param {string} entry The string containing the current calculator string
 */
const deleteEntry = (entry) => {
    let updatedEntry = entry;

    if (updatedEntry.length === 0) {
        return updatedEntry;
    }

    // delete character
    updatedEntry = updatedEntry.substring(0, updatedEntry.length - 1);

    // deleting results in empty output case
    if (updatedEntry.length === 0) {
        updatedEntry = '0';
        return updatedEntry;
    }

    // fixes cases where the entry may end up being a single operator
    // (such as if '-5' gets deleted and results in '-')
    if (isOperator(updatedEntry)) {
        updatedEntry = '0';
        return updatedEntry;
    }

    return updatedEntry;
};

/**
 * Adds the desired operator to the current calcualtor string
 * @param {string} entry The string containing the current calculator string
 * @param {string} operator The string representation of the operator requested
 */
const addOperator = (entry, operator) => {
    let updatedEntry = entry;

    // if there already is an operator, we don't want to add another one right
    // next to it
    if (_endsWithOperator(updatedEntry)) {
        return updatedEntry;
    }

    updatedEntry += operator;

    return updatedEntry;
};

/**
 * Adds a decimal to the current calculator string
 * @param {string} entry The string containing the current calculator string
 */
const addDecimal = (entry) => {
    let updatedEntry = entry;

    const tempSplit = entry.split(/[+-÷×]/);
    if (!tempSplit[tempSplit.length - 1].includes('.')) {
        updatedEntry += '.';
    }

    return updatedEntry;
};

/**
 * Adds a number to the current calculator string
 * @param {string} entry The string containing the current calculator string
 * @param {string} number The number to be added to the current calculator string
 */
const addNumber = (entry, number) => {
    let updatedEntry = entry;

    if (entry === '0') {
        updatedEntry = number;
    } else {
        updatedEntry += number;
    }

    return updatedEntry;
};

/**
 * Calculates the result from the current calculator string
 * @param {string} entry The string containing the current calculator string
 */
const calculateResult = (entry) => {
    let updatedEntry = entry;

    // if the last character is an operator, we don't want to calculate the result
    // as it is not a valid input
    if (_endsWithOperator(updatedEntry)) {
        return updatedEntry;
    }

    const result = _parseExpression(updatedEntry);

    updatedEntry = `${result}`;

    return updatedEntry;
};

$(document).ready(() => {
    let entry = '0';

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

            if (isOperator(buttonText)) {
                entry = addOperator(entry, buttonText);
            } else if (buttonText === '.') {
                entry = addDecimal(entry);
            } else if (buttonText === 'DEL') {
                entry = deleteEntry(entry);
            } else if (buttonText === '=') {
                entry = calculateResult(entry);
            } else {
                entry = addNumber(entry, buttonText);
            }

            $output.text(entry);
        }
    });
});
