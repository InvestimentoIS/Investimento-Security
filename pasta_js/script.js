// Pasta JS/script.js

function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('password-strength');
    let strength = 0;

    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    if (password.length >= 8) strength += 1;

    switch (strength) {
        case 0:
        case 1:
            strengthIndicator.className = 'strength-indicator weak';
            strengthIndicator.style.width = '20%';
            break;
        case 2:
            strengthIndicator.className = 'strength-indicator medium';
            strengthIndicator.style.width = '40%';
            break;
        case 3:
            strengthIndicator.className = 'strength-indicator medium';
            strengthIndicator.style.width = '60%';
            break;
        case 4:
            strengthIndicator.className = 'strength-indicator strong';
            strengthIndicator.style.width = '80%';
            break;
        case 5:
            strengthIndicator.className = 'strength-indicator strong';
            strengthIndicator.style.width = '100%';
            break;
    }
}

document.getElementById('registerForm').addEventListener('submit', function(event) {
    const email = document.getElementById('email').value;
    const confirmEmail = document.getElementById('confirm-email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const dob = new Date(document.getElementById('dob').value);
    const age = new Date().getFullYear() - dob.getFullYear();
    const messageDiv = document.getElementById('message');

    // Limpar mensagens anteriores
    messageDiv.innerHTML = '';

    if (email !== confirmEmail) {
        event.preventDefault();
        messageDiv.innerHTML = '<p class="message-error">Os e-mails não coincidem!</p>';
        return;
    }

    if (password !== confirmPassword) {
        event.preventDefault();
        messageDiv.innerHTML = '<p class="message-error">As senhas não coincidem!</p>';
        return;
    }

    if (age < 20) {
        event.preventDefault();
        messageDiv.innerHTML = '<p class="message-error">Você deve ter 20 anos ou mais para se cadastrar.</p>';
        return;
    }

    // Se tudo estiver correto, mostrar uma mensagem de sucesso
    messageDiv.innerHTML = '<p class="message-success">Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.</p>';
});
