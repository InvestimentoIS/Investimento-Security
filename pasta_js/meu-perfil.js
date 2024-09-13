// Função para carregar os dados do perfil do usuário
async function loadUserProfile() {
    try {
        const token = sessionStorage.getItem('authToken'); // Verifica o token de autenticação

        // Faz a requisição para obter os dados do perfil
        const response = await fetch('/meu-perfil', {
            headers: {
                "Authorization": `Bearer ${token}` // Envia o token no cabeçalho
            }
        });

        if (response.ok) {
            const user = await response.json(); // Obtém os dados do usuário
            console.log(user); // Verifica os dados no console (para depuração)

            // Preencher os campos automaticamente com os dados recebidos do backend
            document.getElementById('username').textContent = user.username;
            document.getElementById('email').textContent = `E-mail: ${user.email}`;
            document.getElementById('country').textContent = `País: ${user.country}`;
            document.getElementById('birthdate').textContent = `Data de Nascimento: ${user.birthdate}`;
            document.getElementById('phone').textContent = `Telefone: ${user.phone}`;
            document.getElementById('profile-photo').src = user.profilePhoto; // Exibe a foto de perfil
        } else {
            Swal.fire('Erro', 'Erro ao carregar os dados do perfil.', 'error');
        }
    } catch (error) {
        Swal.fire('Erro', 'Erro no servidor ao carregar os dados do perfil.', 'error');
        console.error("Erro ao carregar dados do perfil:", error);
    }
}

// Função para fazer o upload da foto de perfil
async function uploadProfilePhoto(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('upload-form')); // Coleta os dados do formulário

    try {
        const token = sessionStorage.getItem('authToken'); // Verifica o token de autenticação

        // Faz a requisição para upload da foto
        const response = await fetch('/upload-profile-photo', {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}` // Envia o token no cabeçalho
            }
        });

        const data = await response.json();
        if (response.ok) {
            // Atualiza a imagem de perfil com a nova foto
            document.getElementById('profile-photo').src = data.newProfilePhoto;
            Swal.fire('Sucesso', 'Foto de perfil atualizada com sucesso!', 'success');
        } else {
            Swal.fire('Erro', data.error || 'Erro ao atualizar a foto de perfil.', 'error');
        }
    } catch (error) {
        Swal.fire('Erro', 'Erro no servidor ao fazer o upload da foto.', 'error');
        console.error('Erro no upload da foto:', error);
    }
}

// Carregar o perfil do usuário ao carregar a página
window.onload = loadUserProfile;

// Adicionar o evento de submit ao formulário de upload de foto
document.getElementById('upload-form').addEventListener('submit', uploadProfilePhoto);
