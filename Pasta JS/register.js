// Função para calcular a idade com base na data de nascimento
function calculateAge(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Lida com o envio do formulário de registro
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const messageDiv = document.getElementById('message');
    messageDiv.classList.remove('error', 'success'); // Remove classes anteriores

    // Validação de idade mínima de 22 anos
    const birthdate = formData.get('dob'); // 'dob' é o campo de data de nascimento
    const age = calculateAge(birthdate);
    
    if (age < 22) {
        messageDiv.classList.add('error');
        messageDiv.textContent = "Você precisa ter pelo menos 22 anos para se cadastrar.";
        setTimeout(() => {
            messageDiv.textContent = ''; 
            messageDiv.classList.remove('error');
        }, 5000);
        return; // Impede o envio do formulário
    }

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
            messageDiv.textContent = "Cadastro bem-sucedido! Verifique seu e-mail para ativar sua conta."; // Mensagem de sucesso

            // Redireciona para a página de login após 5 segundos
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 5000);
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

// Função para verificar a força da senha e exibir a barra de progresso
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('password-strength');
    const strengthBar = document.getElementById('strength-bar');
    let strength = 0;

    // Critérios para determinar a força da senha
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[\W]/.test(password)) strength += 1; // Caracteres especiais

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

// Aplicar a função de exibir/ocultar senha para os ícones
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function () {
        const fieldId = this.previousElementSibling.getAttribute('id');
        togglePasswordVisibility(fieldId);
    });
});

// Adicionar um evento para verificar a força da senha enquanto o usuário digita
document.getElementById('password').addEventListener('input', checkPasswordStrength);
