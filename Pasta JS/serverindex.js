require('dotenv').config(); // Carrega as variáveis do .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');

// Configurando o aplicativo Express
const app = express();
app.use(bodyParser.json());

// Servindo arquivos estáticos da pasta principal "Cadastro"
// Subimos dois diretórios para acessar a pasta "Cadastro"
app.use(express.static(path.join(__dirname, '..', '..', 'Cadastro')));
app.use(express.static(path.join(__dirname, '..', '..', 'Pasta CSS')));  // Servir arquivos da Pasta CSS

// Conectando ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

// Função para enviar o e-mail de verificação
function sendVerificationEmail(user) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const verificationUrl = `http://localhost:3003/index.html?userId=${user._id}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
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
    isVerified: { type: Boolean, default: false }, // Verifica se o usuário confirmou o e-mail
});

const User = mongoose.model('User', UserSchema);

// Rota de registro
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;

        if (password !== confirm_password) {
            return res.status(400).json({ error: "As senhas não coincidem." });
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ error: "Nome de usuário já existe." });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: "E-mail já cadastrado." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Envia o e-mail de verificação
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

        user.isVerified = true;
        await user.save();

        res.redirect('/index.html'); // Redireciona para a página inicial após a verificação
    } catch (error) {
        res.status(500).json({ error: "Erro ao verificar e-mail." });
    }
});

// Rota para servir o arquivo index.html explicitamente
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Cadastro', 'index.html'));  // Corrigido o caminho
});

// Rota para servir a página inicial como padrão
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Cadastro', 'index.html'));  // Corrigido o caminho
});

// Inicialização do servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
