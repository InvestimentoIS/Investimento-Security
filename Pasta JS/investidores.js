// Menu responsivo
const menuIcon = document.getElementById('menu-icon');
const navList = document.getElementById('nav-list');

// Função para abrir/fechar o menu no celular
menuIcon.addEventListener('click', function () {
    navList.classList.toggle('show'); // Exibe ou oculta o menu
});

// Fecha o menu se clicar fora dele
document.addEventListener('click', function (event) {
    const target = event.target; // O elemento que foi clicado
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

// Gráficos de Crescimento
const investor1Chart = new Chart(document.getElementById('investor1-chart'), {
    type: 'line',
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            label: 'Crescimento',
            data: [1000000, 980000, 1020000, 1100000, 1080000, 1150000, 1200000],
            borderColor: '#004a99',
            fill: false
        }]
    },
    options: { responsive: true }
});

const investor2Chart = new Chart(document.getElementById('investor2-chart'), {
    type: 'line',
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            label: 'Crescimento',
            data: [750000, 780000, 800000, 850000, 820000, 900000, 950000],
            borderColor: '#004a99',
            fill: false
        }]
    },
    options: { responsive: true }
});

// Função Ver Mais para carregar 50 investidores
const investorTable = document.getElementById('investor-table');
const loadMoreBtn = document.getElementById('load-more');

loadMoreBtn.addEventListener('click', () => {
    // Código para carregar mais investidores dinamicamente
    loadMoreBtn.style.display = 'none'; // Esconde o botão após carregar
});
