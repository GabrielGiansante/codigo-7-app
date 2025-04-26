const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: 'SUA_ACCESS_TOKEN_AQUI' // Substitua pela sua chave de acesso
});

app.post('/create_preference', async (req, res) => {
  try {
    const { description, price, quantity } = req.body;

    const preference = {
      items: [{
        title: description,
        unit_price: Number(price),
        quantity: Number(quantity),
      }],
      back_urls: {
        success: 'https://seusite.com/sucesso',
        failure: 'https://seusite.com/erro',
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});
