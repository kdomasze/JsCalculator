$(document).ready(() => {

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
            // temp code to ensure buttons are working
            let text = $(event.currentTarget).text();
            $('.output').text(text);
        }
    });
});