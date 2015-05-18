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
    $('.slot_1').click(function(){
        socket.emit('add to lobby', { my: 'data' });
    });
    $('.slot_2').click(function(){
        socket.emit('add to lobby', { my: 'data' });
    });
    socket.on('you enter lobby', function(data){
       alert(data.you);
    });
});
/* Style end */

var socket = io.connect('http://localhost:3000');
socket.on('eventClient', function (data) {
    console.log(data);
});
socket.emit('eventServer', { data: 'Hello Server' });