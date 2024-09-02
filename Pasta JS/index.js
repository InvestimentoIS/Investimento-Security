// Função para controlar a exibição do menu em dispositivos móveis
const menuIcon = document.querySelector('.menu-icon');
const navList = document.querySelector('.nav-list');

menuIcon.addEventListener('click', () => {
    navList.classList.toggle('show'); // Alterna a exibição do menu
});

// Função para ocultar o menu em telas maiores
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navList.classList.remove('show'); // Oculta o menu se a tela for maior que 768px
    }
});

// Verificação de autenticação (ajuste de acordo com sua lógica real)
function isAuthenticated() {
    // Exemplo de verificação de autenticação
    return localStorage.getItem('loggedIn') === 'true';
}

document.addEventListener("DOMContentLoaded", function() {
    const headerLogado = document.getElementById('header-logado');
    const headerNaoLogado = document.getElementById('header-nao-logado');

    if (isAuthenticated()) {
        headerLogado.style.display = 'block';
        headerNaoLogado.style.display = 'none';
    } else {
        headerLogado.style.display = 'none';
        headerNaoLogado.style.display = 'block';
    }
});
const mongoose = require('mongoose');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado ao MongoDB com sucesso');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err.message);
        process.exit(1); // Encerra o processo se a conexão falhar
    }
};

module.exports = connectDB;
