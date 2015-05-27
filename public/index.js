/* Style start */
$(document).ready(function() {
    var infoBlock = document.getElementById('information');
    infoBlock.innerHTML = '<h4 style="text-align: center">Welcome to the game Bomberman!</h4><br>';
    $('.button-info').click(function () {
        if ($(this).hasClass('active')) {
            $('#information').css({'display': 'none'});
            $(this).removeClass('active');
        }
        else {
            $('#information').css({'display': 'block'});
            $(this).addClass('active');
        }
    });
    $('.slot_1 a').click(function(){
        socket.emit('add to lobby', { slot: 1 });
    });
    $('.slot_2 a').click(function(){
        socket.emit('add to lobby', { slot: 2 });
    });
    $('.slot_3 a').click(function(){
        socket.emit('add to lobby', { slot: 3 });
    });
    $('.slot_4 a').click(function(){
        socket.emit('add to lobby', { slot: 4 });
    });
});
/* Style end */

var socket = io.connect();

socket.emit('view stat');

socket.on('you enter lobby', function(data){
    $('.slot_'+data.slot+' a').addClass('display-none');
    $('.slot_'+data.slot+' .ico_'+data.slot).addClass('display-flex');
    var infoBlock = document.getElementById('information');
    var text = '<p>Slot '+data.slot+' - redy to Play!!</p><br>';
    infoBlock.innerHTML += text;
});

socket.on('information', function(data) {
    var infoBlock = document.getElementById('information');
    var text = '';
    if(data.counts != 0){
        for(var i = 0; i < data.counts; i++){
            if(!$('.slot_'+data.slots[i]+' a').hasClass('display-none')){
                text = '<p>Slot '+data.slots[i]+' - redy to Play!!</p><br>';
                $('.slot_'+data.slots[i]+' a').addClass('display-none');
            }
            if(!$('.slot_'+data.slots[i]+' .ico_'+data.slots[i]).hasClass('display-flex')){
                $('.slot_'+data.slots[i]+' .ico_'+data.slots[i]).addClass('display-flex');
            }
        }
    }
    infoBlock.innerHTML += text;
});