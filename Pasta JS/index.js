// Função para verificar autenticação (ajuste conforme sua lógica)
function isAuthenticated() {
    // Verifique o estado de autenticação do usuário
    // Este é apenas um exemplo simplificado
    return localStorage.getItem('loggedIn') === 'true';
}

// Função que inicializa os comportamentos do menu e autenticação
function initializeMenuAndAuth() {
    const menuIcon = document.querySelector('.menu-icon');
    const navList = document.querySelector('.nav-list');
    const mobileMenu = document.querySelector('.mobile-menu');
    const headerLogado = document.getElementById('header-logado');
    const headerNaoLogado = document.getElementById('header-nao-logado');

    // Controle do menu em dispositivos móveis
    menuIcon.addEventListener('click', () => {
        navList.classList.toggle('show'); // Alterna a exibição do menu
        mobileMenu.classList.toggle('open'); // Alterna a exibição do menu móvel
    });

    // Ajusta a visibilidade do menu em telas maiores
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navList.classList.remove('show'); // Oculta o menu em telas maiores
            mobileMenu.classList.remove('open'); // Oculta o menu móvel em telas maiores
        }
    });

    // Verifica a autenticação do usuário e exibe o header apropriado
    if (isAuthenticated()) {
        headerLogado.style.display = 'block';
        headerNaoLogado.style.display = 'none';
    } else {
        headerLogado.style.display = 'none';
        headerNaoLogado.style.display = 'block';
    }
}

// Inicializa as funções assim que o DOM estiver carregado
document.addEventListener("DOMContentLoaded", initializeMenuAndAuth);
