document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const messageDiv = document.getElementById('message');
    messageDiv.classList.remove('error', 'success'); // Remove classes anteriores

    try {
        const response = await fetch('/register', { // Verifique se esse caminho "/register" é válido no backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.classList.add('success');
            messageDiv.textContent = result.success;

            // Redireciona para a página inicial após 2 segundos
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        messageDiv.classList.add('error');
        messageDiv.textContent = error.message || 'Erro no servidor. Por favor, tente novamente.';

        // Limpa a mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.textContent = ''; 
            messageDiv.classList.remove('error', 'success'); // Remove as classes de mensagem
        }, 5000);
    }
});


function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('password-strength');
    const strengthBar = document.getElementById('strength-bar');
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[\W]/.test(password)) strength += 1;

    strengthBar.style.width = `${strength * 20}%`;

    switch (strength) {
        case 1:
        case 2:
            strengthIndicator.textContent = 'Muito fraca';
            strengthIndicator.style.color = 'red';
            strengthBar.style.backgroundColor = 'red';
            break;
        case 3:
            strengthIndicator.textContent = 'Fraca';
            strengthIndicator.style.color = 'orange';
            strengthBar.style.backgroundColor = 'orange';
            break;
        case 4:
            strengthIndicator.textContent = 'Boa';
            strengthIndicator.style.color = 'yellowgreen';
            strengthBar.style.backgroundColor = 'yellowgreen';
            break;
        case 5:
            strengthIndicator.textContent = 'Muito forte';
            strengthIndicator.style.color = 'green';
            strengthBar.style.backgroundColor = 'green';
            break;
        default:
            strengthIndicator.textContent = '';
            strengthBar.style.backgroundColor = '';
            break;
    }
}
// Lida com o envio do formulário de registro
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const messageDiv = document.getElementById('message');
    messageDiv.classList.remove('error', 'success'); // Remove classes anteriores

    try {
        const response = await fetch('/register', { // Certifique-se de que o caminho "/register" é válido no backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.classList.add('success');
            messageDiv.textContent = result.success;

            // Redireciona para a página inicial após 2 segundos
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        messageDiv.classList.add('error');
        messageDiv.textContent = error.message || 'Erro no servidor. Por favor, tente novamente.';

        // Limpa a mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.textContent = ''; 
            messageDiv.classList.remove('error', 'success'); // Remove as classes de mensagem
        }, 5000);
    }
});

// Função para exibir/ocultar senha
function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = passwordField.nextElementSibling;
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.textContent = '🔓'; // Ícone de "senha visível"
    } else {
        passwordField.type = 'password';
        toggleIcon.textContent = '🔐'; // Ícone de "senha oculta"
    }
}
