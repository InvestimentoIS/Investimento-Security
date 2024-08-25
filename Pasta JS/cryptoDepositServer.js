const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/api/generate-address', async (req, res) => {
    const { currency, amount } = req.body;

    if (!currency || !amount) {
        return res.status(400).json({ message: 'Parâmetros inválidos' });
    }

    try {
        const response = await axios.post('https://api.commerce.coinbase.com/charges', {
            name: `Depósito de ${amount} em ${currency.toUpperCase()}`,
            description: `Depósito de $${amount} em ${currency.toUpperCase()}`,
            pricing_type: 'fixed_price',
            local_price: {
                amount: amount,
                currency: 'USD'
            },
            metadata: {
                customer_id: 'ID_DO_CLIENTE',
                customer_name: 'Cliente'
            }
        }, {
            headers: {
                'X-CC-Api-Key': 'SUA_API_KEY',
                'X-CC-Version': '2018-03-22',
                'Content-Type': 'application/json'
            }
        });

        const chargeData = response.data;

        const addressObject = chargeData.data.addresses;
        const address = addressObject[currency.toLowerCase()] || addressObject['usdc'];

        if (address) {
            res.json({
                address: address,
                expirationTime: chargeData.data.expires_at
            });
        } else {
            res.status(400).json({ message: 'Criptomoeda não suportada' });
        }
    } catch (error) {
        console.error('Erro ao configurar a requisição:', error.message);
        res.status(500).json({ message: 'Erro ao gerar endereço de depósito' });
    }
});

app.listen(3001, () => {
    console.log('Servidor de depósito em criptomoedas rodando na porta 3001');
});
