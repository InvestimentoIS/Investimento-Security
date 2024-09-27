// Função para abrir/fechar o menu no celular (usuário não logado)
const menuIconNaoLogado = document.getElementById('menu-icon-nao-logado');
const navListNaoLogado = document.getElementById('nav-list-nao-logado');

// Função para abrir/fechar o menu no celular (usuário logado)
const menuIconLogado = document.getElementById('menu-icon-logado');
const navListLogado = document.getElementById('nav-list-logado');

// Verifica se os elementos do menu de usuário não logado existem antes de adicionar event listeners
if (menuIconNaoLogado && navListNaoLogado) {
    // Função para abrir/fechar o menu no celular
    menuIconNaoLogado.addEventListener('click', function () {
        navListNaoLogado.classList.toggle('show'); // Exibe ou oculta o menu
        console.log('Menu não logado clicado, classe "show" foi ' + (navListNaoLogado.classList.contains('show') ? 'adicionada' : 'removida'));
    });

    // Fecha o menu se clicar fora dele
    document.addEventListener('click', function (event) {
        const target = event.target;

        if (!navListNaoLogado.contains(target) && !menuIconNaoLogado.contains(target)) {
            navListNaoLogado.classList.remove('show');
            console.log('Menu não logado fechado ao clicar fora dele.');
        }
    });

    // Oculta o menu ao redimensionar a janela
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navListNaoLogado.classList.remove('show'); // Fecha o menu em telas maiores
            console.log('Menu não logado fechado ao redimensionar para uma largura maior que 768px.');
        }
    });
}

// Verifica se os elementos do menu de usuário logado existem antes de adicionar event listeners
if (menuIconLogado && navListLogado) {
    // Função para abrir/fechar o menu no celular
    menuIconLogado.addEventListener('click', function () {
        navListLogado.classList.toggle('show'); // Exibe ou oculta o menu
        console.log('Menu logado clicado, classe "show" foi ' + (navListLogado.classList.contains('show') ? 'adicionada' : 'removida'));
    });

    // Fecha o menu se clicar fora dele
    document.addEventListener('click', function (event) {
        const target = event.target;

        if (!navListLogado.contains(target) && !menuIconLogado.contains(target)) {
            navListLogado.classList.remove('show');
            console.log('Menu logado fechado ao clicar fora dele.');
        }
    });

    // Oculta o menu ao redimensionar a janela
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navListLogado.classList.remove('show'); // Fecha o menu em telas maiores
            console.log('Menu logado fechado ao redimensionar para uma largura maior que 768px.');
        }
    });
}

// Função para verificar se o usuário está logado
async function checkAuthStatus() {
    try {
        const response = await fetch('https://investimento-security.onrender.com/auth-status', {
            method: 'GET',
            credentials: 'include', // Inclui cookies de autenticação na solicitação
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const { isLoggedIn, username } = await response.json();

        const headerLogado = document.getElementById('header-logado');
        const headerNaoLogado = document.getElementById('header-nao-logado');
        const usernameDisplay = document.getElementById('username-display');

        if (isLoggedIn) {
            // Exibe o cabeçalho para usuários logados
            headerLogado.style.display = 'block';
            headerNaoLogado.style.display = 'none';

            // Exibe o nome do usuário
            if (usernameDisplay) {
                usernameDisplay.textContent = `Bem-vindo, ${username}`;
            }
        } else {
            // Exibe o cabeçalho para usuários não logados
            headerLogado.style.display = 'none';
            headerNaoLogado.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao verificar o status de autenticação:', error);
    }
}

// Verifica o status de autenticação quando a página carrega
window.addEventListener('DOMContentLoaded', checkAuthStatus);

// Função de logout
async function logoutUser() {
    try {
        const response = await fetch('https://investimento-security.onrender.com/logout', {
            method: 'POST',
            credentials: 'include', // Inclui cookies para o logout
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            window.location.href = 'https://investimentois.github.io/Investimento-Security/index.html'; // Redireciona para index.html após logout
        } else {
            console.error('Erro ao fazer logout.');
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Adiciona um listener ao botão de logout
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
}
