const net = require('net');

const alvo = 'http://dinhe.com/';
const porta = 80; // Você pode mudar para outras portas

const scanner = new net.Socket();

scanner.setTimeout(1000);

scanner.connect(porta, alvo, function() {
    console.log('Porta ' + porta + ' está aberta no alvo ' + alvo);
    scanner.destroy();
});

scanner.on('error', function(e) {
    console.log('Porta ' + porta + ' está fechada ou o alvo ' + alvo + ' não está acessível.');
});
