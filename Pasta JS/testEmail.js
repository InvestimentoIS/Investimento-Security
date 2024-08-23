const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'richtradereps@gmail.com', // Seu e-mail
        pass: 'xtqs maat qtth byet' // Senha do aplicativo
    }
});

const mailOptions = {
    from: 'richtradereps@gmail.com',
    to: 'seu-email-de-ericlenedesousa@gmail.com', // Substitua pelo seu e-mail de teste
    subject: 'Teste de Envio de E-mail',
    text: 'Se você está recebendo este e-mail, o Nodemailer está funcionando!'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Erro ao enviar e-mail:', error);
    }
    console.log('E-mail enviado:', info.response);
});
