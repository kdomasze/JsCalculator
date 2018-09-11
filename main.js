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
}

const calculateResult = (entry, output) => {
    let result = 0;
    let lastOperator = '+';
    for (let i in entry.text) {
        if (isNumeric(entry.text[i])) {
            result = _handleOperator(lastOperator, Number(entry.text[i]), result);
        } else {
            lastOperator = entry.text[i];
        }
    }

    entry.text = ['' + result];
    entry.index = 0;
    output.text(entry.text.join(''));
};

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
