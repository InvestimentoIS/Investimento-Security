// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');

    // Alterna entre os tipos de input (password e text)
    if (passwordField.type === 'password') {
        passwordField.type = 'text'; // Exibe a senha
        toggleIcon.textContent = '🔓'; // Atualiza o ícone para "senha visível"
    } else {
        passwordField.type = 'password'; // Oculta a senha
        toggleIcon.textContent = '🔐'; // Atualiza o ícone para "senha oculta"
    }
}

// Aplica o evento ao ícone de exibir/ocultar senha
document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);

// Lida com o envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const messageDiv = document.getElementById('message');
    messageDiv.classList.remove('error', 'success'); // Remove classes anteriores
    messageDiv.style.display = 'none'; // Esconde a mensagem no início

    try {
        const response = await fetch('http://localhost:3003/login', { // Certifique-se de que o caminho "/login" é válido no backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.classList.add('success');
            messageDiv.textContent = "Login bem-sucedido! Redirecionando...";
            messageDiv.style.display = 'block'; // Exibe a mensagem de sucesso

            // Redireciona para a página index.html após o login
            setTimeout(() => {
                window.location.href = '/index.html'; // Redireciona para a página principal
            }, 2000);
        } else {
            throw new Error(result.error); // Captura erros, incluindo e-mail não verificado
        }
    } catch (error) {
        messageDiv.classList.add('error');
        messageDiv.textContent = error.message || 'Erro no servidor. Por favor, tente novamente.';
        messageDiv.style.display = 'block'; // Exibe a mensagem de erro

        // Limpa a mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.style.display = 'none'; 
            messageDiv.textContent = ''; 
            messageDiv.classList.remove('error', 'success'); // Remove as classes de mensagem
        }, 5000);
    }
});
