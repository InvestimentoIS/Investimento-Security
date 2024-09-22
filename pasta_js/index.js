document.addEventListener('DOMContentLoaded', () => {
    // Simulação de verificação de login (substitua com lógica real)
    const isLoggedIn = false; // Altere para true para simular login

    if (isLoggedIn) {
        document.getElementById('header-nao-logado').style.display = 'none';
        document.getElementById('header-logado').style.display = 'flex';
    } else {
        document.getElementById('header-nao-logado').style.display = 'flex';
        document.getElementById('header-logado').style.display = 'none';
    }

    // Alternância de menu para mobile (opcional)
    const menuIcon = document.getElementById('menu-icon');
    const navListNaoLogado = document.getElementById('nav-list-nao-logado');
    const navListLogado = document.getElementById('nav-list-logado');

    menuIcon.addEventListener('click', () => {
        if (isLoggedIn) {
            navListLogado.classList.toggle('active');
        } else {
            navListNaoLogado.classList.toggle('active');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Verifica se o usuário está autenticado
    if (!token) {
        window.location.href = 'login.html'; // Redireciona para a página de login se não estiver autenticado
    } else {
        fetch('/auth-status', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (!data.isLoggedIn) {
                window.location.href = 'login.html'; // Redireciona se a resposta indicar que não está logado
            } else {
                // Renderiza as informações do usuário logado aqui, se necessário
                console.log('Usuário logado:', data.username);
            }
        })
        .catch(err => {
            console.error('Erro ao verificar autenticação:', err);
            window.location.href = 'login.html'; // Redireciona em caso de erro
        });
    }
});
