// Pasta JS/acoes.js

// Saldo inicial da conta do usuário
let saldoConta = 10000.00; // Inicialmente $10,000.00 para testes

// Função para exibir saldo no HTML
function exibirSaldo() {
    const saldoElemento = document.getElementById('saldo');
    saldoElemento.innerText = `Saldo: $${saldoConta.toFixed(2)}`;
}

// Função para criar uma lista de ações com nomes, preços iniciais e quantidade disponível
function gerarAcoes() {
    const acoes = [
        { nome: 'Alpha Corp', preco: 15.75, qtDisponivel: 20000 },
        { nome: 'Beta Industries', preco: 22.10, qtDisponivel: 15000 },
        { nome: 'Gamma Technologies', preco: 48.00, qtDisponivel: 10000 },
        { nome: 'Delta Energy', preco: 5500.00, qtDisponivel: 300 },
        { nome: 'Epsilon Pharmaceuticals', preco: 820.00, qtDisponivel: 5000 },
        // Continue adicionando até 50 ações com preços variando de $10 a $20,000
    ];

    // Adicionar outras ações com preços variados de $10 a $20,000
    while (acoes.length < 50) {
        acoes.push({
            nome: `Ação ${String.fromCharCode(70 + acoes.length)} Corp`,
            preco: parseFloat((Math.random() * 19990 + 10).toFixed(2)), // Preços entre $10 e $20,000
            qtDisponivel: Math.floor(Math.random() * 9500 + 500) // Quantidade variando de 500 a 10,000
        });
    }

    return acoes;
}

// Função para gerar uma variação aleatória entre -0.50% e +0.50%, sempre positiva ou negativa
function gerarVariacao() {
    const variacao = (Math.random() * 1 - 0.5).toFixed(2);
    return variacao == 0 ? gerarVariacao() : variacao; // Garantir que não haja valor neutro
}

// Função para atualizar as ações na tabela
function atualizarAcoes() {
    const acoes = gerarAcoes();
    const tbody = document.getElementById('acoesBody');
    tbody.innerHTML = ''; // Limpar a tabela

    acoes.forEach(acao => {
        const variacao = gerarVariacao();
        const novaVariacao = parseFloat(variacao);
        const novoPreco = parseFloat(acao.preco) * (1 + novaVariacao / 100);
        acao.preco = novoPreco.toFixed(2);

        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${acao.nome}</td>
            <td>$${acao.preco}</td>
            <td class="${novaVariacao > 0 ? 'positive' : 'negative'}">${novaVariacao > 0 ? '+' : ''}${novaVariacao}%</td>
            <td>${acao.qtDisponivel}</td>
            <td><input type="number" value="1" min="1" max="${acao.qtDisponivel}" id="quantidade-${acao.nome}" onblur="persistQuantidade('${acao.nome}')"></td>
            <td>15%</td>
            <td><button class="buy-btn" onclick="comprarAcao('${acao.nome}', ${acao.preco})">Comprar</button></td>
            <td><button class="sell-btn" onclick="venderAcao('${acao.nome}', ${acao.preco})">Vender</button></td>
        `;

        tbody.appendChild(tr);
    });
}

// Função para iniciar o ciclo de atualização a cada 5 segundos
function iniciarAtualizacao() {
    atualizarAcoes();
    setInterval(atualizarAcoes, 5000); // Atualizar a cada 5 segundos
}

// Função para adicionar saldo (depósito)
function adicionarSaldo(valor) {
    saldoConta += valor;
    exibirSaldo();
}

// Função para comprar uma ação
function comprarAcao(nome, preco) {
    const quantidade = parseInt(document.getElementById(`quantidade-${nome}`).value);
    const custoTotal = quantidade * preco;

    if (quantidade > 0) {
        if (saldoConta >= custoTotal) {
            saldoConta -= custoTotal;
            atualizarQuantidadeDisponivel(nome, -quantidade);
            registrarTransacao('Compra', nome, quantidade, custoTotal);
            exibirSaldo();
            alert(`Você comprou ${quantidade} ações de ${nome} por $${custoTotal.toFixed(2)}`);
            window.location.href = "comprar.html"; // Redirecionar para a página de compra
        } else {
            alert(`Saldo insuficiente! Você precisa de $${(custoTotal - saldoConta).toFixed(2)} a mais.`);
        }
    } else {
        alert("Quantidade inválida.");
    }
}

// Função para vender uma ação
function venderAcao(nome, preco) {
    const quantidade = parseInt(document.getElementById(`quantidade-${nome}`).value);
    const valorVenda = quantidade * preco;

    if (quantidade > 0) {
        saldoConta += valorVenda;
        atualizarQuantidadeDisponivel(nome, quantidade);
        registrarTransacao('Venda', nome, quantidade, valorVenda);
        exibirSaldo();
        alert(`Você vendeu ${quantidade} ações de ${nome} por $${valorVenda.toFixed(2)}`);
        window.location.href = "vender.html"; // Redirecionar para a página de venda
    } else {
        alert("Quantidade inválida.");
    }
}

// Função para atualizar a quantidade disponível
function atualizarQuantidadeDisponivel(nome, quantidade) {
    const tabela = document.getElementById('acoesTable');
    for (let i = 1, row; row = tabela.rows[i]; i++) {
        if (row.cells[0].innerText === nome) {
            let qtDisponivel = parseInt(row.cells[3].innerText);
            qtDisponivel += quantidade;
            row.cells[3].innerText = qtDisponivel;
            break;
        }
    }
}

// Função para registrar transações no histórico
let historicoTransacoes = [];

function registrarTransacao(tipo, nome, quantidade, valorTotal) {
    const data = new Date().toLocaleString();
    historicoTransacoes.push({ tipo, nome, quantidade, valorTotal, data });
    exibirHistorico();
}

// Função para exibir o histórico de transações
function exibirHistorico() {
    const historicoElemento = document.getElementById('historico');
    historicoElemento.innerHTML = ''; // Limpar o histórico

    historicoTransacoes.forEach(transacao => {
        const tr = document.createElement('tr');
        tr.className = transacao.tipo === 'Compra' ? 'compra' : 'venda'; // Cor do histórico
        tr.innerHTML = `
            <td>${transacao.tipo}</td>
            <td>${transacao.nome}</td>
            <td>${transacao.quantidade}</td>
            <td>$${transacao.valorTotal.toFixed(2)}</td>
            <td>${transacao.data}</td>
        `;
        historicoElemento.appendChild(tr);
    });
}

// Função para persistir a quantidade ao sair do campo
function persistQuantidade(nome) {
    const quantidadeInput = document.getElementById(`quantidade-${nome}`);
    const quantidade = quantidadeInput.value;

    if (quantidade < 1) {
        quantidadeInput.value = 1;
    }
}

// Função para iniciar o sistema ao carregar a página
function iniciarSistema() {
    exibirSaldo(); // Exibir saldo ao iniciar
    iniciarAtualizacao(); // Iniciar a atualização das ações
}

// Iniciar o sistema ao carregar a página
document.addEventListener('DOMContentLoaded', iniciarSistema);
// Pasta JS/acoes.js

// Função para exibir saldo no HTML, sincronizado com sessionStorage
function exibirSaldo() {
    const saldoConta = parseFloat(sessionStorage.getItem('saldoConta'));
    const saldoElemento = document.getElementById('saldo');
    if (saldoElemento) {
        saldoElemento.innerText = `Saldo: $${saldoConta.toFixed(2)}`;
    }
}

// Função para inicializar o sistema na página de ações
function iniciarSistema() {
    if (!sessionStorage.getItem('saldoConta')) {
        sessionStorage.setItem('saldoConta', '10000.00'); // Saldo inicial de $10,000.00
    }
    exibirSaldo(); // Exibir saldo sincronizado
    iniciarAtualizacao(); // Iniciar a atualização das ações
}

// Função para comprar uma ação
function comprarAcao(nome, preco) {
    const quantidade = parseInt(document.getElementById(`quantidade-${nome}`).value);
    const custoTotal = quantidade * preco;
    const saldoConta = parseFloat(sessionStorage.getItem('saldoConta'));

    if (quantidade > 0) {
        if (saldoConta >= custoTotal) {
            sessionStorage.setItem('saldoConta', (saldoConta - custoTotal).toFixed(2));
            atualizarQuantidadeDisponivel(nome, -quantidade);
            registrarTransacao('Compra', nome, quantidade, custoTotal);
            exibirSaldo();
            alert(`Você comprou ${quantidade} ações de ${nome} por $${custoTotal.toFixed(2)}`);
            window.location.href = "comprar.html"; // Redirecionar para a página de compra
        } else {
            alert(`Saldo insuficiente! Você precisa de $${(custoTotal - saldoConta).toFixed(2)} a mais.`);
        }
    } else {
        alert("Quantidade inválida.");
    }
}

// Função para vender uma ação
function venderAcao(nome, preco) {
    const quantidade = parseInt(document.getElementById(`quantidade-${nome}`).value);
    const saldoConta = parseFloat(sessionStorage.getItem('saldoConta'));

    const historico = historicoTransacoes.filter(transacao => transacao.tipo === 'Compra' && transacao.nome === nome);

    const totalComprado = historico.reduce((total, transacao) => total + transacao.quantidade, 0);

    if (quantidade > 0 && totalComprado >= quantidade) {
        const valorVenda = quantidade * preco;
        sessionStorage.setItem('saldoConta', (saldoConta + valorVenda).toFixed(2));
        atualizarQuantidadeDisponivel(nome, quantidade);
        registrarTransacao('Venda', nome, quantidade, valorVenda);
        exibirSaldo();
        alert(`Você vendeu ${quantidade} ações de ${nome} por $${valorVenda.toFixed(2)}`);
        window.location.href = "vender.html"; // Redirecionar para a página de venda
    } else {
        alert("Quantidade inválida ou você não possui ações suficientes para vender.");
    }
}

// Verificar se o usuário está logado ao iniciar a página
function verificarLogin() {
    if (!sessionStorage.getItem('loggedIn') || sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html'; // Redirecionar para a página de login se não estiver logado
    }
}

// Iniciar o sistema e verificar login ao carregar a página de ações
document.addEventListener('DOMContentLoaded', () => {
    verificarLogin();
    iniciarSistema();
});
    // Função para vender uma ação
function venderAcao(nome, preco) {
    const quantidade = parseInt(document.getElementById(`quantidade-${nome}`).value);
    const saldoConta = parseFloat(sessionStorage.getItem('saldoConta'));

    // Verificar o histórico para garantir que o usuário comprou essa quantidade
    const historico = historicoTransacoes.filter(transacao => transacao.tipo === 'Compra' && transacao.nome === nome);

    // Calcular a quantidade total comprada dessa ação
    const totalComprado = historico.reduce((total, transacao) => total + transacao.quantidade, 0);

    if (quantidade > 0 && totalComprado >= quantidade) {
        const valorVenda = quantidade * preco;
        sessionStorage.setItem('saldoConta', (saldoConta + valorVenda).toFixed(2));
        atualizarQuantidadeDisponivel(nome, quantidade);
        registrarTransacao('Venda', nome, quantidade, valorVenda);
        exibirSaldo();
        alert(`Você vendeu ${quantidade} ações de ${nome} por $${valorVenda.toFixed(2)}`);
        window.location.href = "vender.html"; // Redirecionar para a página de venda
    } else {
        alert("Quantidade inválida ou você não possui ações suficientes para vender.");
    }
}
