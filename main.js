$(document).ready(() => {
    const entry = {
        text: [''],
        index: 0
    };

    const $output = $('.output');

    // blinking cursor for output
    setInterval(() => {
        $('.output').toggleClass('blinking-cursor');
    }, 500);

    // button effects for numbers
    $('.num-area').hover(event => {
        if (!($(event.currentTarget).hasClass('empty'))) {
            $(event.currentTarget).toggleClass('num-area-active');
        }
    });

    // button effects for operators
    $('.operator-area').hover(event => {
        if (!($(event.currentTarget).hasClass('empty'))) {
            $(event.currentTarget).toggleClass('operator-area-active');
        }
    });

    // button logic
    $('.button').on('click', event => {
        if (!($(event.currentTarget).hasClass('empty'))) {
            let buttonText = $(event.currentTarget).text();

            if (buttonText === '÷' || buttonText === '×' || buttonText === '-' || buttonText === '+') {
                addOperator(entry, buttonText, $output);
            } else if (buttonText === '.') {
                addDecimal(entry, $output);
            } else if (buttonText === 'DEL') {
                deleteEntry(entry, $output);
            } else if (buttonText === '=') {
                calculateResult(entry, $output);
            } else {
                addNumber(entry, buttonText, $output);
            }
        }
    });
});

const deleteEntry = (entry, output) => {
    if (entry.index === 0 && entry.text[entry.index].length === 0) {
        return;
    }

    // end of entry after operator case
    if (entry.text[entry.index].length === 0) {
        entry.text.pop();
        entry.index--;
    }

    // delete character
    entry.text[entry.index] = entry.text[entry.index].substring(0, entry.text[entry.index].length - 1);

    // deleting results in empty output case
    if (entry.index === 0 && entry.text[entry.index].length === 0) {
        output.text('0');
        return;
    }

    // display output
    output.text(entry.text.join(''));
};

const addOperator = (entry, buttonText, output) => {
    entry.index++;
    entry.text[entry.index] = buttonText;
    entry.index++;
    entry.text[entry.index] = '';
    output.text(entry.text.join(''));
};

const addDecimal = (entry, output) => {
    if (!entry.text[entry.index].includes('.')) {
        entry.text[entry.index] += '.';
    }
    output.text(entry.text.join(''));
};

const addNumber = (entry, buttonText, output) => {
    if (entry.length === 0) {
        entry.text.push('');
        entry.index = 0;
    }

    entry.text[entry.index] += buttonText;
    output.text(entry.text.join(''));
};

const calculateResult = (entry, output) => {

    let joinedExpression = entry.text.join('');

    let result = _parseExpression(joinedExpression);

    entry.text = ['' + result];
    entry.index = 0;
    output.text(entry.text.join(''));
};

const _seperateOutHighOrderOperations = (expression) => {
    let calculation = [];
    let temp = '';

    for (let i in expression) {
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

// this function will calculate all the multiplication and division expression and return
// an array of numbers and operators (bound to '+' and '-')
const _calculateLowerOrderExpression = (higherOrderExpression) => {
    let lowerOrderExpression = [];

    for (let i in higherOrderExpression) {
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

            let splitOperation = higherOrderExpression[i].split(operator);
            let tempResult = splitOperation[0];
            // loop through each number in the current operation and ensure they are all
            // multiplied or divided together
            for (let j = 1; j < splitOperation.length; j++) {
                tempResult = _handleOperator(operator, splitOperation[j], tempResult);
            }
            lowerOrderExpression.push(tempResult);
        }
    }

    return lowerOrderExpression;
};

const _calculateResult = (lowerOrderExpression) => {
    let result = 0;
    let lastOperator = '+';

    for (let i in lowerOrderExpression) {
        if (isNumeric(lowerOrderExpression[i])) {
            result = _handleOperator(lastOperator, Number(lowerOrderExpression[i]), result);
        } else {
            lastOperator = lowerOrderExpression[i];
        }
    }

    return result;
};

const _parseExpression = (joinedExpression) => {
    let higherOrderExpression = _seperateOutHighOrderOperations(joinedExpression);
    let lowerOrderExpression = _calculateLowerOrderExpression(higherOrderExpression);
    let result = _calculateResult(lowerOrderExpression);
    return result;
}

const _handleOperator = (operator, num, result) => {
    switch (operator) {
        case '+':
            result += num;
            break;
        case '-':
            result -= num;
            break;
        case '×':
            result *= num;
            break;
        case '÷':
            result /= num;
            break;
    }

    return result;
};

const isNumeric = (num) => {
    return !isNaN(num);
};

