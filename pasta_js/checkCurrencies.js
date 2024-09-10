const axios = require('axios');

async function checkEnabledCryptos() {
    try {
        const response = await axios.get('https://api.commerce.coinbase.com/currencies', {
            headers: {
                'X-CC-Api-Key': 'c71eca71-2913-4c2d-8589-ebb976d6ffcf', // Substitua pela sua chave da API
                'X-CC-Version': '2018-03-22'
            }
        });

        console.log('Criptomoedas Habilitadas:', response.data);
    } catch (error) {
        console.error('Erro ao obter as criptomoedas habilitadas:', error.response ? error.response.data : error.message);
    }
}

checkEnabledCryptos();
