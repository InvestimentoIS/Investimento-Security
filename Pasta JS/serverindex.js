const express = require('express');
const path = require('path');
const app = express();

// Define a pasta onde os arquivos estáticos (HTML, CSS, JS) estão localizados
app.use(express.static(path.join(__dirname, '../')));

// Define a rota principal para o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Inicia o servidor na porta 3003
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
