// Pasta JS/cryptoDepositServer.js
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

// Rota para gerar o endereço de depósito em USDC na rede Ethereum
app.post('/api/generate-address', async (req, res) => {
    const { depositAmount } = req.body;

    if (depositAmount < 1) {
        console.error('Erro: O valor mínimo de depósito é $1');
        return res.status(400).json({ message: 'O valor mínimo de depósito é $1' });
    }

    try {
        // Integração com a API da Coinbase Commerce
        const response = await axios.post('https://api.commerce.coinbase.com/charges', {
            name: 'Depósito em USDC',
            description: `Depósito de $${depositAmount} em USDC`,
            local_price: {
                amount: depositAmount,
                currency: 'USD'
            },
            pricing_type: 'fixed_price',
            metadata: {
                customer_id: uuidv4(),
                customer_name: 'Cliente'
            }
        }, {
            headers: {
                'X-CC-Api-Key': 'c71eca71-2913-4c2d-8589-ebb976d6ffcf',
                'X-CC-Version': '2018-03-22'
            },
            timeout: 10000  // Aumentar o tempo de espera para 10 segundos
        });

        const charge = response.data.data;

        if (!charge.addresses || !charge.addresses['ETH']) {
            throw new Error(`Endereço para USDC na rede Ethereum não encontrado na resposta da API.`);
        }

        res.json({
            address: charge.addresses['ETH'],
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

// Rota para verificar o status do pagamento
app.get('/api/check-payment/:chargeId', async (req, res) => {
    const { chargeId } = req.params;

    try {
        const response = await axios.get(`https://api.commerce.coinbase.com/charges/${chargeId}`, {
            headers: {
                'X-CC-Api-Key': 'c71eca71-2913-4c2d-8589-ebb976d6ffcf',
                'X-CC-Version': '2018-03-22'
            },
            timeout: 10000  // Aumentar o tempo de espera para 10 segundos
        });

        const charge = response.data.data;

        if (charge.timeline[charge.timeline.length - 1].status === 'COMPLETED') {
            res.json({ status: 'completed', amount: charge.pricing.local.amount });
        } else {
            res.json({ status: 'pending' });
        }
    } catch (error) {
        console.error('Erro ao verificar o pagamento:', error.message);
        res.status(500).json({ message: 'Erro ao verificar pagamento. ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de depósito em criptomoedas rodando na porta ${PORT}`);
});
