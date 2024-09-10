require('dotenv').config(); // Carrega as variáveis do .env
const nodemailer = require('nodemailer');

// Certifique-se de que as variáveis de ambiente estão carregando
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

// Configurando o Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Carregado do arquivo .env
        pass: process.env.EMAIL_PASS  // Carregado do arquivo .env
    }
});

// Configurações do e-mail a ser enviado
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'emaildeteste@exemplo.com', // Coloque aqui um e-mail de teste para receber a mensagem
    subject: 'Teste de Envio de E-mail',
    text: 'Este é um e-mail de teste enviado usando Nodemailer!'
};

// Enviando o e-mail
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Erro ao enviar e-mail:', error);
    } else {
        console.log('E-mail enviado:', info.response);
    }
});
require('dotenv').config(); // Carrega as variáveis do .env

// Teste de carregamento das variáveis
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
