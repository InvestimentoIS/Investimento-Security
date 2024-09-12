require('dotenv').config(); // Certifique-se de que está no topo do arquivo
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require('path');
const session = require('express-session'); // Suporte para sessões
const multer = require('multer'); // Upload de arquivos
const fs = require('fs'); // Manipulação de arquivos
const MongoStore = require('connect-mongo'); // Store de sessões no MongoDB

// Configurando o aplicativo Express
const app = express();

// Habilitar CORS com configuração para permitir credenciais
const corsOptions = {
    origin: 'https://investimentois.github.io',  // Ajustar o domínio permitido
    credentials: true,  // Permitir cookies e credenciais nas requisições
    optionsSuccessStatus: 200,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// Middleware para analisar o corpo da requisição
app.use(bodyParser.json());

// Servindo arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configurando sessões
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Defina como true se estiver usando HTTPS em produção
}));
// Servir arquivos estáticos da pasta "Cadastro"
app.use(express.static(path.join(__dirname, '..', 'Cadastro')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve a pasta de uploads

// Conectando ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsInsecure: process.env.NODE_ENV !== 'production' // Ajuste: desabilitar TLS apenas em dev
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
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

    const verificationUrl = `https://investimento-security.onrender.com/verify?userId=${user._id}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verifique seu e-mail para ativar sua conta',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #333;">
                <h1 style="color: #4CAF50;">Seja bem-vindo!</h1>
                <p>Para completar seu cadastro e ativar sua conta, clique no botão abaixo:</p>
                <a href="${verificationUrl}" 
                   style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                   Verificar E-mail
                </a>
                <p>Se você não solicitou este cadastro, ignore este e-mail.</p>
                <p>Atenciosamente, <br> Equipe Investimento Security</p>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Erro ao enviar e-mail:', err);
        } else {
            console.log('E-mail enviado:', info.response);
        }
    });
}

// Configurando sessões usando MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // MongoDB para sessões
        collectionName: 'sessions', // Coleção onde as sessões são armazenadas
    }),
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Definir como true em produção (HTTPS)
        httpOnly: true, // Impedir acesso via JavaScript
        maxAge: 1000 * 60 * 60 * 24, // Expiração do cookie (1 dia)
    }
}));

// Verificando se a pasta 'uploads/' existe, e a cria se não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Diretório 'uploads' criado em ${uploadDir}`);
}

// Definindo o modelo de usuário com Mongoose
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profilePhoto: { type: String, default: '/uploads/default-profile.png' },
    country: { type: String, default: 'Brasil' },
    birthdate: { type: String, default: '01/01/2000' },
    phone: { type: String, default: '(11) 99999-9999' }
});

const User = mongoose.model('User', UserSchema);

// Middleware para verificar se o usuário está logado
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Não autorizado. Por favor, faça login.' });
    }
}

// Rota para buscar os dados do usuário logado
app.get('/meu-perfil', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

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

// Configuração do Multer para upload de imagem de perfil (ajustes em tamanho/tipo de arquivo)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Pasta para uploads
    },
    filename: (req, file, cb) => {
        cb(null, `${req.session.userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error('Tipo de arquivo não permitido'), false);
    } else {
        cb(null, true);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 2 } // Limite de 2MB por arquivo
});

// Rota para upload da foto de perfil
app.post('/upload-profile-photo', isAuthenticated, upload.single('profilePhoto'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const newProfilePhoto = `/uploads/${req.file.filename}`;

    try {
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

        if (password !== confirm_password) {
            return res.status(400).json({ error: "As senhas não coincidem." });
        }

        // Validação adicional de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'E-mail inválido.' });
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
            password: hashedPassword,
            country,
            birthdate,
            phone
        });

        await newUser.save();

        sendVerificationEmail(newUser);

        res.status(201).json({ success: "Cadastro bem-sucedido! Verifique seu e-mail." });
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor. Por favor, tente novamente." });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ error: 'E-mail não verificado. Por favor, verifique seu e-mail.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais incorretas.' });
        }

        req.session.userId = user._id;

        res.status(200).json({ 
            success: true, 
            message: 'Login realizado com sucesso.',
            user: {
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                country: user.country,
                birthdate: user.birthdate,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor. Por favor, tente novamente.' });
    }
});

// Rota de verificação de e-mail
app.get('/verify', async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ success: 'E-mail verificado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar o e-mail.' });
    }
});

// Rota para verificar o status de autenticação
app.get('/auth-status', (req, res) => {
    if (req.session.userId) {
        res.json({ isLoggedIn: true, username: req.session.username });
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
        res.status(200).json({ message: 'Logout bem-sucedido!' }); // Retorna status 200 ao frontend
    });
});
// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
