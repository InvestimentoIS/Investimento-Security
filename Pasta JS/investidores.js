// Menu responsivo
const menuIcon = document.getElementById('menu-icon');
const navList = document.getElementById('nav-list');

// Função para abrir/fechar o menu no celular
menuIcon.addEventListener('click', function () {
    navList.classList.toggle('show'); // Exibe ou oculta o menu
});

// Fecha o menu se clicar fora dele
document.addEventListener('click', function (event) {
    const target = event.target;
    if (!navList.contains(target) && !menuIcon.contains(target)) {
        navList.classList.remove('show');
    }
});

// Oculta o menu ao redimensionar a janela
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        navList.classList.remove('show');
    }
});

// Gráficos de Crescimento com cores e números realistas
function createInvestorChart(canvasId, data, isGrowth) {
    const color = isGrowth ? 'green' : 'red';
    new Chart(document.getElementById(canvasId), {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Crescimento',
                data: data,
                borderColor: color,
                fill: false
            }]
        },
        options: { responsive: true }
    });
}

createInvestorChart('investor1-chart', [1234567.89, 1200000.50, 1250000.35, 1285000.76, 1270000.15, 1300000.90], true);
createInvestorChart('investor2-chart', [789654.32, 760000.25, 780000.47, 800000.12, 820000.63, 850000.98], false);

// Função Ver Mais para carregar mais investidores
const investorTable = document.getElementById('investor-table');
const loadMoreBtn = document.getElementById('load-more');

loadMoreBtn.addEventListener('click', () => {
    const additionalInvestors = `
        <tr>
            <td>Roberto Carvalho</td>
            <td>$654,321.78</td>
            <td>$3,276.45</td>
            <td><canvas id="investor3-chart"></canvas></td>
        </tr>
        <tr>
            <td>Eduarda Costa</td>
            <td>$432,198.32</td>
            <td>$2,154.67</td>
            <td><canvas id="investor4-chart"></canvas></td>
        </tr>
        <!-- Adicione mais investidores aqui -->
    `;
    investorTable.innerHTML += additionalInvestors;

    // Adiciona novos gráficos
    createInvestorChart('investor3-chart', [654321.78, 600000.89, 610000.34, 630000.45, 620000.78, 640000.99], false);
    createInvestorChart('investor4-chart', [432198.32, 450000.23, 440000.78, 430000.90, 420000.45, 410000.89], true);

    loadMoreBtn.style.display = 'none'; // Esconde o botão após carregar
});
