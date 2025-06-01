import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import twilio from 'twilio';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Agora, a leitura das variáveis de ambiente é feita apenas uma vez
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

console.log('SID:', accountSid);  // Verificando o SID
console.log('TOKEN:', authToken); // Verificando o TOKEN
console.log('PHONE:', process.env.TWILIO_PHONE_NUMBER);  // Verificando o número

let codigoGerado = null;

app.post('/enviar-codigo', async (req, res) => {
  const numero = req.body.numero;

  if (!numero) {
    return res.status(400).json({ erro: 'Número não fornecido.' });
  }

  codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Número de origem:', process.env.TWILIO_PHONE_NUMBER);
  console.log('Número de destino:', numero);
  
  try {
    await client.messages.create({
      body: `Seu código de verificação é: ${codigoGerado}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: numero
    });

    console.log('Código enviado:', codigoGerado);

    res.json({ sucesso: true });
  } catch (erro) {
    console.error('Erro ao enviar código:', erro);
    res.status(500).json({ erro: 'Erro ao enviar o código.' });
  }
});

app.post('/verificar-codigo', (req, res) => {
  const codigo = req.body.codigo;

  if (codigo === codigoGerado) {
    res.json({ sucesso: true });
  } else {
    res.json({ sucesso: false });
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
