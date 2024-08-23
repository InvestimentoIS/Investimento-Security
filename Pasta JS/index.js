// Pasta JS/index.js
document.addEventListener('DOMContentLoaded', function() {
    const userLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
    const authLinks = document.querySelectorAll('.auth-links');
    const userInfo = document.querySelector('.user-info');
    const userMenu = document.querySelector('.user-menu');
    const userMenuIcon = document.getElementById('user-menu-icon');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutButton = document.getElementById('logout');

    if (userLoggedIn) {
        authLinks.forEach(link => link.classList.add('hidden'));
        userInfo.classList.remove('hidden');
        userMenu.classList.remove('hidden');
    } else {
        authLinks.forEach(link => link.classList.remove('hidden'));
        userInfo.classList.add('hidden');
        userMenu.classList.add('hidden');
    }

    userMenuIcon.addEventListener('click', () => {
        userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function(event) {
        if (!userMenu.contains(event.target)) {
            userDropdown.style.display = 'none';
        }
    });

    logoutButton.addEventListener('click', function() {
        sessionStorage.removeItem('loggedIn');
        window.location.href = 'index.html';
    });
});

function simulateLogin() {
    sessionStorage.setItem('loggedIn', 'true');
    window.location.href = 'index.html';
}

function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = passwordField.nextElementSibling;
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.textContent = '🔓';
    } else {
        passwordField.type = 'password';
        toggleIcon.textContent = '🔐';
    }
}

function calculateReturn() {
    const amount = document.getElementById('investmentAmount').value;
    const rate = document.getElementById('rateOfReturn').value;
    const years = document.getElementById('investmentYears').value;

    const finalAmount = amount * Math.pow(1 + rate / 100, years);
    const resultDiv = document.getElementById('investmentResult');
    resultDiv.innerHTML = `O valor final após ${years} anos será de €${finalAmount.toFixed(2)}`;
}
// Pasta JS/index.js

// Função para inicializar o saldo na página index
function initializeSaldo() {
    if (!sessionStorage.getItem('saldoConta')) {
        sessionStorage.setItem('saldoConta', '10000.00'); // Saldo inicial de $10,000.00
    }
    updateSaldoDisplay();
}

function updateSaldoDisplay() {
    const saldoConta = parseFloat(sessionStorage.getItem('saldoConta'));
    const saldoElemento = document.getElementById('saldo');
    if (saldoElemento) {
        saldoElemento.innerText = `Saldo: $${saldoConta.toFixed(2)}`;
    }
}

// Função para adicionar saldo (depósito)
function adicionarSaldo(valor) {
    let saldoConta = parseFloat(sessionStorage.getItem('saldoConta'));
    saldoConta += valor;
    sessionStorage.setItem('saldoConta', saldoConta.toFixed(2));
    updateSaldoDisplay();
}

// Inicializar o saldo ao carregar a página index
document.addEventListener('DOMContentLoaded', initializeSaldo);
// Pasta JS/index.js

// Função para verificar o login e atualizar o cabeçalho
function verificarLogin() {
    const userLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
    const authLinks = document.querySelectorAll('.auth-links');
    const userInfo = document.querySelector('.user-info');
    const userMenu = document.querySelector('.user-menu');

    if (userLoggedIn) {
        authLinks.forEach(link => link.style.display = 'none');
        userInfo.style.display = 'block';
        userMenu.style.display = 'block';
        updateSaldoDisplay();
    } else {
        authLinks.forEach(link => link.style.display = 'inline');
        userInfo.style.display = 'none';
        userMenu.style.display = 'none';
    }
}

// Iniciar a página index com saldo e login
document.addEventListener('DOMContentLoaded', () => {
    initializeSaldo();
    verificarLogin();
});
