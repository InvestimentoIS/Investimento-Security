document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("deposit-form");
    const qrCodeDiv = document.getElementById("qrcode");
    const depositAddressP = document.getElementById("deposit-address");
    const expirationTimeP = document.getElementById("expiration-time");
    const depositErrorP = document.getElementById("deposit-error");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const currency = document.getElementById("currency").value;
        const amount = document.getElementById("amount").value;

        try {
            const response = await fetch("http://localhost:3001/api/generate-address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    currency: currency,
                    amount: amount
                })
            });

            if (response.ok) {
                const data = await response.json();
                const depositAddress = data.address || '';
                const expirationTime = data.expirationTime || 'Data de expiração não encontrada';

                console.log("Endereço de depósito gerado:", depositAddress);

                if (depositAddress) {
                    depositAddressP.textContent = `Endereço: ${depositAddress}`;
                    expirationTimeP.textContent = `O endereço expira em: ${expirationTime}`;
                    depositErrorP.textContent = '';

                    // Verifique se o endereço é válido
                    if (/^0x[a-fA-F0-9]{40}$/.test(depositAddress)) {
                        try {
                            QRCode.toCanvas(qrCodeDiv, depositAddress, { width: 200, height: 200 }, function(error) {
                                if (error) {
                                    console.error("Erro ao gerar QR Code:", error);
                                    depositErrorP.textContent = 'Erro ao gerar QR Code.';
                                } else {
                                    console.log("QR Code gerado com sucesso.");
                                }
                            });
                        } catch (qrError) {
                            console.error("Erro ao gerar QR Code:", qrError);
                            depositErrorP.textContent = 'Erro ao gerar QR Code.';
                        }
                    } else {
                        depositErrorP.textContent = 'Endereço inválido para geração de QR Code.';
                        qrCodeDiv.innerHTML = ''; // Limpar QR Code, se houver
                    }
                } else {
                    depositErrorP.textContent = 'Endereço de depósito não encontrado.';
                    depositAddressP.textContent = '';
                    expirationTimeP.textContent = '';
                    qrCodeDiv.innerHTML = ''; // Limpar QR Code, se houver
                }
            } else {
                depositErrorP.textContent = 'Erro ao gerar endereço de depósito: ' + response.statusText;
            }
        } catch (error) {
            console.error("Erro ao gerar endereço de depósito:", error);
            depositErrorP.textContent = 'Erro ao gerar endereço de depósito: ' + error.message;
        }
    });
});
