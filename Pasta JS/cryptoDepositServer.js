const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Habilitar CORS para todas as rotas
app.use(cors());
app.use(bodyParser.json());

const PORT = 3001; // Porta do servidor

const supportedCryptos = {
    ETH: 'Ethereum',
    BTC: 'Bitcoin',
    LTC: 'Litecoin',
    DOGE: 'Dogecoin',
    BCH: 'Bitcoin Cash',
    USDC: 'USD Coin',
    DAI: 'Dai',
    APE: 'ApeCoin',
    SHIB: 'SHIBA INU',
    USDT: 'Tether',
    PMATIC: 'Matic (Polygon)',
    PUSDC: 'Bridged USD Coin (Polygon)',
    POLUSDC: 'USD Coin (Polygon)',
    PWETH: 'Wrapped Ether (Polygon)'
};

app.post('/api/generate-address', async (req, res) => {
    const { depositAmount, selectedCrypto } = req.body;

    console.log(`\nSolicitação de depósito recebida: ${depositAmount} em ${selectedCrypto}`);

    if (depositAmount < 1) {
        console.error('Erro: O valor mínimo de depósito é $1');
        return res.status(400).json({ message: 'O valor mínimo de depósito é $1' });
    }

    if (!supportedCryptos[selectedCrypto]) {
        console.error('Erro: Criptomoeda não suportada');
        return res.status(400).json({ message: 'Criptomoeda não suportada' });
    }

    try {
        const response = await axios.post('https://api.commerce.coinbase.com/charges', {
            name: `Depósito em ${supportedCryptos[selectedCrypto]}`,
            description: `Depósito de $${depositAmount} em ${supportedCryptos[selectedCrypto]}`,
            local_price: {
                amount: depositAmount,
                currency: 'USD'
            },
            pricing_type: 'fixed_price',
            metadata: {
                customer_id: uuidv4(),
                customer_name: 'Cliente'
            },
            expires_at: new Date(Date.now() + 20 * 60 * 1000).toISOString() // Expiração em 20 minutos
        }, {
            headers: {
                'X-CC-Api-Key': 'c71eca71-2913-4c2d-8589-ebb976d6ffcf',
                'X-CC-Version': '2018-03-22'
            },
            timeout: 10000 // Tempo de espera de 10 segundos
        });

        const charge = response.data.data;

        console.log("Resposta da API:", charge);

        let cryptoAddress;

        // Tentar obter o endereço diretamente de `web3_data.contract_addresses`
        if (charge.web3_data && charge.web3_data.contract_addresses) {
            cryptoAddress = charge.web3_data.contract_addresses['1']; // Verificando se a rede 1 (Ethereum) retorna o endereço
            console.log(`Endereço gerado para ${selectedCrypto}: ${cryptoAddress}`);
        } else {
            console.error('Erro: A estrutura web3_data ou contract_addresses não foi encontrada na resposta da API.');
        }

        // Lidar com o caso onde o endereço não é encontrado
        if (!cryptoAddress) {
            throw new Error(`Endereço para ${supportedCryptos[selectedCrypto]} não encontrado na resposta da API.`);
        }

        res.json({
            address: cryptoAddress,
            qrCodeUrl: charge.hosted_url,
            chargeId: charge.id
        });
    } catch (error) {
        if (error.response) {
            console.error('Erro na API da Coinbase:', error.response.data);
            res.status(500).json({ message: 'Erro ao gerar endereço de depósito: ' + error.response.data });
        } else if (error.request) {
            console.error('Nenhuma resposta recebida da API da Coinbase:', error.request);
            res.status(500).json({ message: 'Erro ao se comunicar com a API da Coinbase. Tente novamente mais tarde.' });
        } else {
            console.error('Erro ao configurar a requisição:', error.message);
            res.status(500).json({ message: 'Erro interno do servidor: ' + error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de depósito em criptomoedas rodando na porta ${PORT}`);
});
