// URL do backend hospedado no Render
const backendURL = 'https://investimento-security.onrender.com'; // Substitua pela URL correta do seu backend

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
// Usuario logado e não logado
const token = localStorage.getItem('authToken'); // Ou sessionStorage, cookies

if (token) {
    // O usuário está logado
    fetch("/api/user-info", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(response => response.json())
    .then(data => console.log("Usuário logado:", data.username));
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
    messageDiv.classList.remove('error', 'success'); // Remove classes anteriores
    messageDiv.style.display = 'none'; // Esconde a mensagem no início

    try {
        const response = await fetch(`${backendURL}/login`, { // Usa a URL do backend no Render
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
                window.location.href = "https://investimentois.github.io/Investimento-Security/index.html";
            }, 2000);
        } else {
            throw new Error(result.error || "Credenciais inválidas.");
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

// Função para buscar e exibir os dados do usuário logado
async function fetchUserProfile() {
    try {
        const response = await fetch(`${backendURL}/meu-perfil`, { // Usa a rota /meu-perfil do backend
            method: 'GET',
            credentials: 'include' // Inclui cookies/sessões na requisição
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
