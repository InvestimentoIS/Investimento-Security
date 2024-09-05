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
