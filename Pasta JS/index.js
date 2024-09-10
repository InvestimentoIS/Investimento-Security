// Seleciona o ícone do menu e o menu
const menuIcon = document.getElementById('menu-icon');
const navList = document.getElementById('nav-list');

// Função para abrir/fechar o menu no celular
menuIcon.addEventListener('click', function () {
    navList.classList.toggle('show'); // Exibe ou oculta o menu
});

// Fecha o menu se clicar fora dele
document.addEventListener('click', function (event) {
    const target = event.target; // O elemento que foi clicado

    // Verifica se o clique foi fora do menu ou do ícone do menu
    if (!navList.contains(target) && !menuIcon.contains(target)) {
        navList.classList.remove('show'); // Fecha o menu
    }
});

// Oculta o menu ao redimensionar a janela
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        navList.classList.remove('show'); // Fecha o menu em telas maiores
    }
});

// Função para verificar se o usuário está logado
async function checkAuthStatus() {
    try {
        const response = await fetch('http://localhost:3003/auth-status');
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
        const response = await fetch('http://localhost:3003/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            window.location.href = '/index.html'; // Redireciona para index.html após logout
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
