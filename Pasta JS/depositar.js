// Pasta JS/depositar.js

document.getElementById('depositoForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir o envio padrão do formulário

    const depositAmount = parseFloat(document.getElementById('depositAmount').value);
    const statusMessage = document.getElementById('statusMessage');
    const depositInfo = document.getElementById('depositInfo');
    const depositAddress = document.getElementById('depositAddress');
    const qrCodeImage = document.getElementById('qrCodeImage');
    const countdownElement = document.getElementById('countdown');
    const checkPaymentButton = document.getElementById('checkPayment');

    // Validar o valor do depósito
    if (isNaN(depositAmount) || depositAmount < 1) {
        statusMessage.style.color = 'red';
        statusMessage.innerText = 'O valor mínimo para depósito é $1.';
        return;
    }

    // Solicitar a geração de um endereço de depósito
    try {
        const response = await fetch('http://localhost:3001/api/generate-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ depositAmount })
        });

        const data = await response.json();

        if (response.ok) {
            depositAddress.innerText = data.address;
            qrCodeImage.src = data.qrCodeUrl;
            depositInfo.style.display = 'block';
            statusMessage.innerText = '';

            let timeLeft = 1200; // 20 minutos em segundos

            const countdown = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                countdownElement.innerText = `Tempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    statusMessage.style.color = 'red';
                    statusMessage.innerText = 'O endereço de depósito expirou. Por favor, gere um novo.';
                    depositInfo.style.display = 'none';
                }
            }, 1000);

            // Verificar o pagamento após clicar no botão
            checkPaymentButton.style.display = 'block';
            checkPaymentButton.addEventListener('click', async () => {
                const paymentResponse = await fetch(`http://localhost:3001/api/check-payment/${data.chargeId}`);
                const paymentData = await paymentResponse.json();

                if (paymentData.status === 'completed') {
                    adicionarSaldo(parseFloat(paymentData.amount));
                    statusMessage.style.color = 'green';
                    statusMessage.innerText = `Depósito de $${paymentData.amount} confirmado!`;
                    clearInterval(countdown);
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 5000);
                } else {
                    statusMessage.style.color = 'orange';
                    statusMessage.innerText = 'Pagamento ainda não confirmado. Verifique novamente mais tarde.';
                }
            });
        } else {
            statusMessage.style.color = 'red';
            statusMessage.innerText = data.message || 'Erro ao gerar endereço de depósito.';
        }
    } catch (error) {
        console.error(error);
        statusMessage.style.color = 'red';
        statusMessage.innerText = 'Erro ao processar o depósito. Tente novamente mais tarde.';
    }
});

// Função para adicionar saldo ao sessionStorage
function adicionarSaldo(valor) {
    let saldoConta = parseFloat(sessionStorage.getItem('saldoConta'));
    saldoConta += valor;
    sessionStorage.setItem('saldoConta', saldoConta.toFixed(2));
}
