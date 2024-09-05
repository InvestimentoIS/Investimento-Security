// Função para controlar a exibição do menu em dispositivos móveis
const menuIcon = document.querySelector('#menu-icon');
const navListNaoLogado = document.querySelector('#nav-list-nao-logado');
const menuIconLogado = document.querySelector('#menu-icon-logado');
const navListLogado = document.querySelector('#nav-list-logado');

// Função para alternar o menu de usuários não logados
menuIcon.addEventListener('click', () => {
    navListNaoLogado.classList.toggle('show');
});

// Função para alternar o menu de usuários logados
menuIconLogado.addEventListener('click', () => {
    navListLogado.classList.toggle('show');
});

// Verificar se o usuário está logado
function isAuthenticated() {
    return localStorage.getItem('loggedIn') === 'true';
}

document.addEventListener('DOMContentLoaded', () => {
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
