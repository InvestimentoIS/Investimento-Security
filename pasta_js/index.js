document.addEventListener('DOMContentLoaded', () => {
    // Simulação de verificação de login (substitua com lógica real)
    const isLoggedIn = false; // Altere para true para simular login

    if (isLoggedIn) {
        document.getElementById('header-nao-logado').style.display = 'none';
        document.getElementById('header-logado').style.display = 'flex';
    } else {
        document.getElementById('header-nao-logado').style.display = 'flex';
        document.getElementById('header-logado').style.display = 'none';
    }

    // Alternância de menu para mobile (opcional)
    const menuIcon = document.getElementById('menu-icon');
    const navListNaoLogado = document.getElementById('nav-list-nao-logado');
    const navListLogado = document.getElementById('nav-list-logado');

    menuIcon.addEventListener('click', () => {
        if (isLoggedIn) {
            navListLogado.classList.toggle('active');
        } else {
            navListNaoLogado.classList.toggle('active');
        }
    });
});
