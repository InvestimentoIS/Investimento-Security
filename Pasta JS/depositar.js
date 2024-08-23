document.getElementById('depositForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const depositAmount = document.getElementById('depositAmount').value;
    const selectedCrypto = document.getElementById('cryptoSelect').value;

    try {
        const response = await fetch('http://localhost:3001/api/generate-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                depositAmount,
                selectedCrypto
            })
        });

        if (!response.ok) {
            throw new Error(`Erro ao gerar endereço de depósito: ${response.statusText}`);
        }

        const result = await response.json();

        document.getElementById('cryptoAddress').innerText = result.address;
        document.getElementById('qrCodeLink').href = result.qrCodeUrl;
        document.getElementById('depositResult').style.display = 'block';
    } catch (error) {
        alert(error.message);
    }
});
