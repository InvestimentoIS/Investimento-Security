document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Verifica se o usuário está autenticado
    if (!token) {
        window.location.href = 'login.html'; // Redireciona para o login se não estiver autenticado
    } else {
        // Busca as informações do usuário
        fetch('/meu-perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                document.getElementById('username').textContent = data.username;
                document.getElementById('balance').textContent = `R$ ${data.balance.toFixed(2)}`;
            } else {
                localStorage.removeItem('token'); // Remove token inválido
                window.location.href = 'login.html'; // Redireciona para o login
            }
        })
        .catch(() => {
            localStorage.removeItem('token');
            window.location.href = 'login.html'; // Redireciona em caso de erro
        });
    }
});
