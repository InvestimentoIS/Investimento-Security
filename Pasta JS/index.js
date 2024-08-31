document.addEventListener("DOMContentLoaded", function() {
    // Seleciona o ícone do menu e o menu móvel
    const menuIcon = document.querySelector('.menu-icon');
    const navList = document.querySelector('.nav-list');

    // Verifica se os elementos existem antes de adicionar o listener
    if (menuIcon && navList) {
        menuIcon.addEventListener('click', function() {
            // Alterna a classe 'show' no menu
            navList.classList.toggle('show');
        });
    }
});

// Exemplo de verificação de autenticação (ajuste de acordo com sua lógica real)
function isAuthenticated() {
    // Verifique o estado de autenticação do usuário
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
