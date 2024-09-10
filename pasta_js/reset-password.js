// Pasta JS/reset-password.js
document.getElementById('resetForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    const messageDiv = document.getElementById('message');
    if (response.ok) {
        messageDiv.innerHTML = `<p class="message-success">${result.success}</p>`;
    } else {
        messageDiv.innerHTML = `<p class="message-error">${result.error}</p>`;
    }

    setTimeout(() => {
        messageDiv.innerHTML = ''; // Limpa a mensagem após 5 segundos
    }, 5000);
});
