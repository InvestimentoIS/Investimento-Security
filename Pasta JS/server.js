const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware para análise de URL encoded (para formulários)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // Para analisar JSON no corpo da requisição
app.use(express.static(path.join(__dirname, '../'))); // Servindo arquivos estáticos

// Configuração do Nodemailer para envio de e-mails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'richtradereps@gmail.com', // Seu e-mail
        pass: 'hepb asfe xzzw wjvf'      // Sua senha
    }
});

// Função para enviar e-mail de verificação
async function sendVerificationEmail(email, username) {
    try {
        let info = await transporter.sendMail({
            from: '"Cadastro" <cadastro@site.com>',
            to: email,
            subject: 'Verificação de Conta',
            text: `Olá ${username}, por favor verifique sua conta clicando no link: http://localhost:3000/verify-email?email=${encodeURIComponent(email)}`
        });
        console.log('E-mail de verificação enviado: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Erro ao enviar e-mail de verificação:', error.message);
        return false;
    }
}

// Rota para registro de usuário
app.post('/register', async (req, res) => {
    try {
        const { username, email, confirm_email, dob, password, confirm_password } = req.body;

        // Validações básicas
        if (!email || !confirm_email || !password || !confirm_password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
        }

        if (email !== confirm_email) {
            return res.status(400).json({ error: 'Os e-mails não coincidem!' });
        }
        if (password !== confirm_password) {
            return res.status(400).json({ error: 'As senhas não coincidem!' });
        }

        // Verificar se a senha é válida
        if (!password || typeof password !== 'string') {
            return res.status(400).json({ error: 'Senha inválida!' });
        }

        // Hash da senha
        const saltRounds = 10; // Número de rounds para gerar o salt
        const hashedPassword = bcrypt.hashSync(password, saltRounds); // Gera o hash da senha

        const usersFilePath = path.join(__dirname, '../Configuração/users.json');
        let users = [];

        // Carregando os dados existentes
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(data);
        }

        // Impede múltiplas contas com o mesmo e-mail
        if (users.some(user => user.email === email)) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        // Adicionar o novo usuário
        users.push({ username, email, dob, password: hashedPassword, verified: false });
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        // Enviar e-mail de verificação
        const emailSent = await sendVerificationEmail(email, username);
        if (emailSent) {
            return res.status(200).json({ success: 'Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.' });
        } else {
            return res.status(500).json({ error: 'Erro ao enviar e-mail de verificação.' });
        }
    } catch (error) {
        console.error('Erro durante o processo de registro:', error.message);
        return res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

// Rota para verificar e-mail
app.get('/verify-email', (req, res) => {
    try {
        const email = req.query.email;
        const usersFilePath = path.join(__dirname, '../Configuração/users.json');
        let users = [];

        // Carregar os dados existentes
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(data);
        }

        // Encontrar o usuário pelo e-mail
        const userIndex = users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            // Marcar o e-mail como verificado
            users[userIndex].verified = true;
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
            res.send('<h2>E-mail verificado com sucesso!</h2>');
        } else {
            res.status(400).send('<h2>E-mail não encontrado.</h2>');
        }
    } catch (error) {
        console.error('Erro durante a verificação do e-mail:', error.message);
        res.status(500).send('Erro no servidor. Tente novamente mais tarde.');
    }
});

// Rota para login de usuário
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usersFilePath = path.join(__dirname, '../Configuração/users.json');
        let users = [];

        // Carregar os dados existentes
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(data);
        }
// Adicionando uma rota para solicitar redefinição de senha
app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const usersFilePath = path.join(__dirname, '../Configuração/users.json');
        let users = [];

        // Carregar os dados existentes
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(data);
        }

        // Encontrar o usuário pelo e-mail
        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(400).json({ error: 'Email não encontrado.' });
        }

        // Enviar e-mail com link para redefinir senha
        const resetLink = `http://localhost:3000/reset-password.html?email=${encodeURIComponent(email)}`;
        await transporter.sendMail({
            from: '"Cadastro" <cadastro@site.com>',
            to: email,
            subject: 'Redefinição de Senha',
            text: `Clique no link para redefinir sua senha: ${resetLink}`
        });

        res.status(200).json({ success: 'Link para redefinição de senha enviado com sucesso para o seu e-mail.' });
    } catch (error) {
        console.error('Erro ao solicitar redefinição de senha:', error.message);
        res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

        // Encontrar o usuário pelo e-mail
        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(400).json({ error: 'Email não encontrado.' });
        }

        // Verificar se o e-mail foi confirmado
        if (!user.verified) {
            return res.status(400).json({ error: 'Por favor, verifique seu e-mail antes de fazer login.' });
        }

        // Comparar a senha
        const isMatch = bcrypt.compareSync(password, user.password);
        if (isMatch) {
            return res.status(200).json({ success: 'Login efetuado com sucesso!' });
        } else {
            return res.status(400).json({ error: 'Senha incorreta. Tente novamente.' });
        }
    } catch (error) {
        console.error('Erro durante o login:', error.message);
        return res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
