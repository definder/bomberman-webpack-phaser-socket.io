/* Style start */
$(document).ready(function() {
    $('.button-info').click(function () {
        if ($(this).hasClass('active')) {
            $('.information').css({'display': 'none'});
            $(this).removeClass('active');
        }
        else {
            $('.information').css({'display': 'block'});
            $(this).addClass('active');
        }
    });
});
/* Style start */

var socket = io.connect('http://localhost:3000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});