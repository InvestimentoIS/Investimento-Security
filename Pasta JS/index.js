// Seleciona o ícone do menu e o menu
const menuIcon = document.getElementById('menu-icon');
const navList = document.getElementById('nav-list');

// Função para abrir/fechar o menu no celular
menuIcon.addEventListener('click', function () {
    navList.classList.toggle('show'); // Exibe ou oculta o menu
});

// Oculta o menu ao redimensionar a janela
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        navList.classList.remove('show'); // Fecha o menu em telas maiores
    }
});
