document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Verifica se o usuário está autenticado
    if (token) {
        // Verifica o status de autenticação
        fetch('/auth-status', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.isLoggedIn) {
                document.getElementById('header-nao-logado').style.display = 'none';
                document.getElementById('header-logado').style.display = 'flex';
            }
        })
        .catch(err => {
            console.error('Erro ao verificar autenticação:', err);
        });
    }
});
