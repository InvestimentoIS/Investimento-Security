// Função para carregar os dados do perfil do usuário
async function loadUserProfile() {
    try {
        const response = await fetch('/meu-perfil'); // Chama a rota /meu-perfil
        if (response.ok) {
            const user = await response.json();
            console.log(user); // Verifica se os dados estão sendo carregados corretamente

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
    }
}

// Função para fazer o upload da foto de perfil
async function uploadProfilePhoto(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('upload-form'));

    try {
        const response = await fetch('/upload-profile-photo', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('profile-photo').src = data.newProfilePhoto;
            Swal.fire('Sucesso', 'Foto de perfil atualizada com sucesso!', 'success');
        } else {
            Swal.fire('Erro', data.error || 'Erro ao atualizar a foto de perfil.', 'error');
        }
    } catch (error) {
        Swal.fire('Erro', 'Erro no servidor ao fazer o upload da foto.', 'error');
    }
}

// Carregar o perfil do usuário ao carregar a página
window.onload = loadUserProfile;

// Adicionar o evento de submit ao formulário de upload de foto
document.getElementById('upload-form').addEventListener('submit', uploadProfilePhoto);
