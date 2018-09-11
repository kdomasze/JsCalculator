$(document).ready(() => {
    // button effects for numbers
    $('.num-area').on('mouseover', event => {
        if (!($(event.currentTarget).hasClass('empty'))) {
            $(event.currentTarget).addClass('num-area-active');
        }
    }).on('mouseleave', event => {
        $(event.currentTarget).removeClass('num-area-active');
    });

    // button effects for operators
    $('.operator-area').on('mouseover', event => {
        if (!($(event.currentTarget).hasClass('empty'))) {
            $(event.currentTarget).addClass('operator-area-active');
        }
    }).on('mouseleave', event => {
        $(event.currentTarget).removeClass('operator-area-active');
    });

    // button logic
    $('.button').on('click', event => {
        if (!($(event.currentTarget).hasClass('empty'))) {
            // temp code to ensure buttons are working
            let text = $(event.currentTarget).text();
            $('.output').text(text);
        }
    });
});