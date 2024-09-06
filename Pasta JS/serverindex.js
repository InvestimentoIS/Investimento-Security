require('dotenv').config(); // Certifique-se de que está no topo do arquivo

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');


// Configurando o aplicativo Express
const app = express();

// Habilitar CORS
app.use(cors());

// Middleware para analisar o corpo da requisição
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta "Cadastro"
app.use(express.static(path.join(__dirname, '..', '..', 'Cadastro')));

// Conectando ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

// Função para enviar o e-mail de verificação usando Nodemailer
function sendVerificationEmail(user) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Serviço de e-mail (Gmail)
        auth: {
            user: process.env.EMAIL_USER, // Carregado do arquivo .env
            pass: process.env.EMAIL_PASS  // Carregado do arquivo .env
        },
        logger: true,  // Ativa o modo de log para depuração
        debug: true    // Ativa o modo de depuração para diagnosticar o erro
    });

    const verificationUrl = `http://localhost:3003/verify?userId=${user._id}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,  // Endereço de e-mail do remetente
        to: user.email,                // Endereço de e-mail do destinatário
        subject: 'Verifique seu e-mail',
        text: `Clique no link para verificar seu e-mail: ${verificationUrl}`,
        html: `<p>Clique no link abaixo para verificar seu e-mail:</p><a href="${verificationUrl}">Verificar e-mail</a>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Erro ao enviar e-mail:', err);
        } else {
            console.log('E-mail enviado:', info.response);
        }
    });
}

// Definindo o modelo de usuário com Mongoose
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);

// Rota de registro
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;

        // Verificar se as senhas coincidem
        if (password !== confirm_password) {
            return res.status(400).json({ error: "As senhas não coincidem." });
        }

        // Verificar se o nome de usuário já existe
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ error: "Nome de usuário já existe." });
        }

        // Verificar se o e-mail já existe
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: "E-mail já cadastrado." });
        }

        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criar o novo usuário
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Enviar o e-mail de verificação
        sendVerificationEmail(newUser);

        res.status(201).json({ success: "Cadastro bem-sucedido! Verifique seu e-mail." });
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor. Por favor, tente novamente." });
    }
});

// Rota de verificação de e-mail
app.get('/verify', async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "Usuário não encontrado." });
        }

        // Verificar o e-mail do usuário
        user.isVerified = true;
        await user.save();

        // Redireciona para a página de login após verificar o e-mail
        res.redirect('/login.html');
    } catch (error) {
        res.status(500).json({ error: "Erro ao verificar e-mail." });
    }
});

// Inicialização do servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
