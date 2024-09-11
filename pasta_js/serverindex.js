require('dotenv').config(); // Certifique-se de que está no topo do arquivo
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require('path');
const session = require('express-session'); // Suporte para sessões
const multer = require('multer'); // Importando multer para upload de arquivos
const fs = require('fs'); // Importando fs para manipulação de arquivos e diretórios
const MongoStore = require('connect-mongo'); // Usando MongoDB como store de sessões

// Configurando o aplicativo Express
const app = express();

// Habilitar CORS
app.use(cors());

// Middleware para analisar o corpo da requisição
app.use(bodyParser.json());

// Conectando ao MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

// Configurando sessões usando MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // Usa o MongoDB como store de sessões
        collectionName: 'sessions', // Nome da coleção onde as sessões serão armazenadas
    }),
    cookie: { secure: false } // Defina como true se estiver usando HTTPS em produção
}));

// Definindo o caminho relativo para a pasta 'uploads'
const uploadDir = path.join(__dirname, 'uploads');

// Verifica se a pasta 'uploads/' existe, e a cria se não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Inclui 'recursive: true' para criar diretórios pai, se necessário
    console.log(`Diretório 'uploads' criado em ${uploadDir}`);
}

// Definindo o modelo de usuário com Mongoose
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profilePhoto: { type: String, default: '/uploads/default-profile.png' },  // Foto de perfil
    country: { type: String, default: 'Brasil' },                             // País do usuário
    birthdate: { type: String, default: '01/01/2000' },                       // Data de nascimento
    phone: { type: String, default: '(11) 99999-9999' }                       // Telefone do usuário
});

const User = mongoose.model('User', UserSchema);

// Rota para buscar os dados do usuário logado
app.get('/meu-perfil', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Enviar os dados do usuário para o front-end
        res.status(200).json({
            username: user.username,
            email: user.email,
            country: user.country,
            birthdate: user.birthdate,
            phone: user.phone,
            profilePhoto: user.profilePhoto
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Configuração do Multer para upload de imagem de perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        cb(null, `${req.session.userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Rota para upload da foto de perfil
app.post('/upload-profile-photo', upload.single('profilePhoto'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const newProfilePhoto = `/uploads/${req.file.filename}`;

    try {
        // Atualizar a foto de perfil do usuário no banco de dados
        await User.updateOne({ _id: req.session.userId }, { profilePhoto: newProfilePhoto });

        res.status(200).json({ success: true, newProfilePhoto });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar a nova foto de perfil.' });
    }
});

// Rota de registro
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirm_password, country, birthdate, phone } = req.body;

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
            password: hashedPassword,
            country,
            birthdate,
            phone
        });

        await newUser.save();

        // Enviar o e-mail de verificação
        sendVerificationEmail(newUser);

        res.status(201).json({ success: "Cadastro bem-sucedido! Verifique seu e-mail." });
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor. Por favor, tente novamente." });
    }
});

// Função para enviar o e-mail de verificação usando Nodemailer
function sendVerificationEmail(user) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        logger: true,
        debug: true
    });

    const verificationUrl = `http://localhost:3003/verify?userId=${user._id}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verifique seu e-mail para ativar sua conta',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #333;">
                <h1 style="color: #4CAF50;">Seja bem-vindo!</h1>
                
                <img src="cid:logo-image" alt="Logo" style="width: 100px; margin-bottom: 20px;" />
        
                <p style="font-size: 18px;">Estamos muito felizes por você estar aqui.</p>
                <p style="font-size: 16px;">Para completar seu cadastro e ativar sua conta, clique no botão abaixo:</p>
                <a href="${verificationUrl}" 
                   style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                   Verificar E-mail
                </a>
                <p style="margin-top: 20px; font-size: 14px;">Se você não se cadastrou em nossa plataforma, ignore este e-mail.</p>
                <p style="color: #888; font-size: 12px; margin-top: 20px;">&copy; 2024 Sua Empresa. Todos os direitos reservados.</p>
            </div>
        `,
        attachments: [
            {
                filename: 'logo_email.jpg',
                path: path.join(__dirname, 'fotos', 'vecteezy_trader-holding-graph-chart-with-arrow-for-analysis-stock_7039565.jpg'),
                cid: 'logo-image',
                contentType: 'image/jpeg'
            }
        ]
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Erro ao enviar e-mail:', err);
        } else {
            console.log('E-mail enviado:', info.response);
        }
    });
}

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

// Rota de login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verifica se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        // Verifica se a senha está correta
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }

        // Verifica se o e-mail foi verificado
        if (!user.isVerified) {
            return res.status(400).json({ error: 'E-mail não verificado. Verifique seu e-mail antes de fazer login.' });
        }

        // Salva os dados do usuário na sessão
        req.session.userId = user._id;
        req.session.username = user.username;

        res.status(200).json({ message: 'Login bem-sucedido!' });
    } catch (error) {
        return res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

// Rota para verificar o status de autenticação
app.get('/auth-status', async (req, res) => {
    if (req.session.userId) {
        const user = await User.findById(req.session.userId);
        res.json({
            isLoggedIn: true,
            username: user.username,
            profilePhoto: user.profilePhoto,
            country: user.country,
            birthdate: user.birthdate,
            phone: user.phone
        });
    } else {
        res.json({ isLoggedIn: false });
    }
});

// Rota de logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao fazer logout. Tente novamente.' });
        }
        res.clearCookie('connect.sid'); // Limpa o cookie de sessão
        res.status(200).json({ message: 'Logout bem-sucedido!' });
    });
});

// Verificação se o arquivo index.html existe para servir como página inicia
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'cadastro', 'index.html'));
});

// Inicialização do servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
