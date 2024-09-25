document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const desktopNavLogado = document.getElementById('nav-list-logado');
    const desktopNavNaoLogado = document.getElementById('nav-list-nao-logado');
    const mobileNav = document.getElementById('nav-list-mobile');
    const menuIcon = document.getElementById('menu-icon');

    // Função para alternar o menu móvel
    menuIcon.addEventListener('click', () => {
        if (mobileNav.style.display === 'none' || mobileNav.style.display === '') {
            mobileNav.style.display = 'block';
        } else {
            mobileNav.style.display = 'none';
        }
    });

    // Verifica se o usuário está autenticado
    if (token) {
        // Usuário logado
        desktopNavNaoLogado.style.display = 'none'; // Esconde o menu para não logados
        desktopNavLogado.style.display = 'flex'; // Mostra o menu para logados

        // Preenche o menu móvel com itens de usuário logado
        mobileNav.innerHTML = `
            <li><a href="dashboard.html">Dashboard</a></li>
            <li class="dropdown">
                <a href="#">Investimentos</a>
                <ul class="dropdown-menu">
                    <li><a href="acoes-garantidas.html">Ações Garantidas</a></li>
                    <li><a href="acoes-nao-garantidas.html">Ações Não Garantidas</a></li>
                    <li><a href="comprar-vender.html">Comprar/Vender</a></li>
                </ul>
            </li>
            <li><a href="depositar.html">Depósito/Saque</a></li>
            <li><a href="notificacoes.html"><img src="Fotos/notificacoes.png" alt="Notificações"></a></li>
            <li class="dropdown perfil-usuario">
                <a href="#"><img src="Fotos/perfil.png" alt="Perfil"></a>
                <ul class="dropdown-menu">
                    <li><a href="meu-perfil.html">Perfil</a></li>
                    <li><a href="configuracoes.html">Configurações</a></li>
                    <li><button id="logout-btn">Sair</button></li>
                </ul>
            </li>
        `;
    } else {
        // Usuário não logado
        desktopNavLogado.style.display = 'none'; // Esconde o menu para logados
        desktopNavNaoLogado.style.display = 'flex'; // Mostra o menu para não logados

        // Preenche o menu móvel com itens de usuário não logado
        mobileNav.innerHTML = `
            <li><a href="index.html">Início</a></li>
            <li><a href="acoes.html">Ações</a></li>
            <li><a href="investidores.html">Investidores</a></li>
            <li><a href="contato.html">Contato</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html">Cadastrar</a></li>
        `;
    }

    // Lida com o logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});
