// URL do backend hospedado no Render
const backendURL = 'https://investimento-security.onrender.com'; // Verifique se esta URL está correta

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

// Verifica se o usuário está logado
const token = sessionStorage.getItem('authToken'); // Usando sessionStorage para maior segurança

if (token) {
    // O usuário está logado, faz uma requisição para obter informações do usuário
    fetch(`${backendURL}/meu-perfil`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Usuário logado:", data.username);
        // Aqui você pode atualizar a UI com as informações do usuário, se necessário
        window.location.href = "https://investimentois.github.io/Investimento-Security/index.html"; // Redireciona para a página principal
    })
    .catch(err => console.error("Erro ao buscar dados do usuário:", err));
} else {
    console.log("Usuário não logado");
}

// Aplica o evento ao ícone de exibir/ocultar senha
document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);

// Lida com o envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form); // Captura os dados do formulário
    const data = Object.fromEntries(formData.entries()); // Converte para um objeto

    const messageDiv = document.getElementById('message');
    messageDiv.classList.remove('error', 'success', 'loading'); // Remove classes anteriores
    messageDiv.style.display = 'none'; // Esconde a mensagem no início

    try {
        // Exibe um loader enquanto a requisição de login está sendo processada
        messageDiv.classList.add('loading');
        messageDiv.textContent = "Fazendo login...";
        messageDiv.style.display = 'block';

        // Faz a requisição de login para o backend
        const response = await fetch(`${backendURL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Envia os dados do formulário
        });

        const result = await response.json();

        if (response.ok) {
            // Login bem-sucedido
            messageDiv.classList.remove('loading');
            messageDiv.classList.add('success');
            messageDiv.textContent = "Login bem-sucedido! Redirecionando...";
            messageDiv.style.display = 'block'; // Exibe a mensagem de sucesso

            // Armazena o token de autenticação no sessionStorage para mais segurança
            sessionStorage.setItem('authToken', result.token);

            // Redireciona para a página principal de forma imediata e otimizada
            window.location.href = "https://investimentois.github.io/Investimento-Security/index.html";
        } else {
            throw new Error(result.error || "Credenciais inválidas.");
        }
    } catch (error) {
        // Exibe mensagem de erro
        messageDiv.classList.remove('loading');
        messageDiv.classList.add('error');
        messageDiv.textContent = error.message || 'Erro no servidor. Por favor, tente novamente.';
        messageDiv.style.display = 'block'; // Exibe a mensagem de erro

        // Limpa a mensagem após 3 segundos
        setTimeout(() => {
            messageDiv.style.display = 'none'; 
            messageDiv.textContent = ''; 
            messageDiv.classList.remove('error', 'success', 'loading'); // Remove as classes de mensagem
        }, 3000);
    }
});

// Função para buscar e exibir os dados do usuário logado
async function fetchUserProfile() {
    const token = sessionStorage.getItem('authToken'); // Usando sessionStorage para maior segurança

    if (!token) {
        // Se não tiver token, redireciona para a página de login
        window.location.href = "https://investimentois.github.io/Investimento-Security/login.html";
        return;
    }

    try {
        const response = await fetch(`${backendURL}/meu-perfil`, { // Usa a rota /meu-perfil do backend
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Não foi possível carregar os dados do perfil.");
        }

        const userData = await response.json();

        // Exibe as informações do usuário logado na página
        document.getElementById('username').textContent = userData.username;
        document.getElementById('email').textContent = userData.email;
        document.getElementById('country').textContent = userData.country;
        document.getElementById('birthdate').textContent = userData.birthdate;
        document.getElementById('phone').textContent = userData.phone;
        document.getElementById('profilePhoto').src = userData.profilePhoto;
    } catch (error) {
        console.error(error);
        // Redireciona para a página de login se o usuário não estiver autenticado
        window.location.href = "https://investimentois.github.io/Investimento-Security/login.html";
    }
}
