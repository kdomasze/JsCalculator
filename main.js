$(document).ready(() => {
    $('.num-area').on('mouseover', event => {
        if (!($(event.currentTarget).hasClass('empty'))) {
            $(event.currentTarget).addClass('num-area-active');
        }
    }).on('mouseleave', event => {
        $(event.currentTarget).removeClass('num-area-active');
    });

    $('.operator-area').on('mouseover', event => {
        if (!($(event.currentTarget).hasClass('empty'))) {
            $(event.currentTarget).addClass('operator-area-active');
        }
    }).on('mouseleave', event => {
        $(event.currentTarget).removeClass('operator-area-active');
    });
});