// Função para buscar dados de BTC em tempo real
async function obterDadosBTC() {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=minute');
  const data = await response.json();
  return data.prices;  // Retorna os preços com timestamps
}

// Função para atualizar o gráfico
async function atualizarGrafico() {
  const dadosBTC = await obterDadosBTC();
  const labels = dadosBTC.map((entry) => {
      const date = new Date(entry[0]);
      return `${date.getHours()}:${date.getMinutes()}`;
  });
  const prices = dadosBTC.map((entry) => entry[1]);

  const ctx = document.getElementById('grafico').getContext('2d');
  
  new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Great Choice',
              data: prices,
              borderColor: '#28a745',
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              borderWidth: 2
          }]
      },
      options: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: false
              }
          }
      }
  });
}

// Calculadora de Ações com Garantia
document.getElementById('calcular-garantia').addEventListener('click', function () {
  const montante = parseFloat(document.getElementById('montante-garantia').value);
  const tempo = parseInt(document.getElementById('tempo-garantia').value);
  const tipoTempo = document.getElementById('tempo-garantia-tipo').value;
  const taxaMensal = 0.15;

  let totalMeses;

  switch (tipoTempo) {
      case 'dias':
          totalMeses = tempo / 30;
          break;
      case 'semanas':
          totalMeses = tempo / 4;
          break;
      case 'anos':
          totalMeses = tempo * 12;
          break;
      default:
          totalMeses = tempo;
          break;
  }

  if (!isNaN(montante) && !isNaN(tempo)) {
      const retorno = montante * Math.pow(1 + taxaMensal, totalMeses);
      document.getElementById('retorno-garantia').textContent = `$${retorno.toFixed(2)}`;
  } else {
      document.getElementById('retorno-garantia').textContent = 'Por favor, insira valores válidos.';
  }
});

// Calculadora de Ações sem Garantia
document.getElementById('calcular-sem-garantia').addEventListener('click', function () {
  const montante = parseFloat(document.getElementById('montante-sem-garantia').value);
  const tempo = parseInt(document.getElementById('tempo-sem-garantia').value);
  const tipoTempo = document.getElementById('tempo-sem-garantia-tipo').value;
  const taxaMaxima = 0.8;

  let totalMeses;

  switch (tipoTempo) {
      case 'dias':
          totalMeses = tempo / 30;
          break;
      case 'semanas':
          totalMeses = tempo / 4;
          break;
      case 'anos':
          totalMeses = tempo * 12;
          break;
      default:
          totalMeses = tempo;
          break;
  }

  if (!isNaN(montante) && !isNaN(tempo)) {
      const retornoEstimado = montante * Math.pow(1 + (taxaMaxima * Math.random()), totalMeses);
      document.getElementById('retorno-sem-garantia').textContent = `$${retornoEstimado.toFixed(2)} (estimado)`;
  } else {
      document.getElementById('retorno-sem-garantia').textContent = 'Por favor, insira valores válidos.';
  }
});

// Atualiza o gráfico ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarGrafico);

// Função para abrir/fechar o menu móvel
function toggleMenu() {
const navList = document.querySelector('.nav-list');
navList.classList.toggle('show');
}

// Fecha o menu quando o usuário clica fora dele
document.addEventListener('click', function(event) {
const menuIcon = document.querySelector('.menu-icon');
const navList = document.querySelector('.nav-list');
if (!menuIcon.contains(event.target) && !navList.contains(event.target)) {
  navList.classList.remove('show');
}
});
