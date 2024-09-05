// Função para buscar dados de uma moeda em tempo real (usando BTC como exemplo)
async function obterDadosBTC() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=minute');
    const data = await response.json();
    return data.prices;  // Retorna os preços com timestamps
}

// Função para atualizar o gráfico em tempo real
async function atualizarGrafico() {
    const dadosBTC = await obterDadosBTC();

    // Extrair labels e dados de preços
    const labels = dadosBTC.map((entry) => {
        const date = new Date(entry[0]);
        return `${date.getHours()}:${date.getMinutes()}`;
    });
    const prices = dadosBTC.map((entry) => entry[1]);

    const ctx = document.getElementById('grafico').getContext('2d');
    
    // Renderiza o gráfico com Chart.js
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

// Chama a função para atualizar o gráfico ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarGrafico);





// Cálculo para ações com garantia
document.getElementById('calcular-garantia').addEventListener('click', function () {
    const montante = parseFloat(document.getElementById('montante-garantia').value);
    const tempo = parseInt(document.getElementById('tempo-garantia').value);
    const tipoTempo = document.getElementById('tempo-garantia-tipo').value;
    const taxaMensal = 0.15; // 15% ao mês
  
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
  
  // Cálculo para ações sem garantia
  document.getElementById('calcular-sem-garantia').addEventListener('click', function () {
    const montante = parseFloat(document.getElementById('montante-sem-garantia').value);
    const tempo = parseInt(document.getElementById('tempo-sem-garantia').value);
    const tipoTempo = document.getElementById('tempo-sem-garantia-tipo').value;
    const taxaMaxima = 0.8; // Até 80% de retorno
  
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
  
  // Configurando o gráfico de ações usando Chart.js
  const ctx = document.getElementById('grafico').getContext('2d');
  const graficoAcoes = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
              label: 'Ação Exemplo',
              data: [1200, 1250, 1300, 1280, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750],
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
  