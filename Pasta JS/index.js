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
