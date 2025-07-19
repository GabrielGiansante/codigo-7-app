import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import twilio from 'twilio';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// As credenciais são carregadas aqui, mas NÃO SÃO EXIBIDAS nos logs.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

let codigoGerado = null;

app.post('/enviar-codigo', async (req, res) => {
  const numero = req.body.numero;
  if (!numero) {
    return res.status(400).json({ erro: 'Número não fornecido.' });
  }
  codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Tentando enviar código ${codigoGerado} para ${numero}`);
  try {
    await client.messages.create({
      body: `Seu código de verificação é: ${codigoGerado}`,
      from: twilioPhoneNumber,
      to: numero
    });
    console.log('Código enviado com sucesso.');
    res.json({ sucesso: true });
  } catch (erro) {
    console.error('Erro do Twilio ao enviar código:', erro.message);
    res.status(500).json({ erro: 'Erro ao enviar o código de verificação.' });
  }
});

app.post('/verificar-codigo', (req, res) => {
  const codigo = req.body.codigo;
  if (codigo && codigo === codigoGerado) {
    res.json({ sucesso: true });
  } else {
    res.json({ sucesso: false });
  }
});

// ===== NOVA ROTA PARA ABRIR O PORTÃO (APENAS UMA VEZ) =====
app.post('/abrir-portao', (req, res) => {
  console.log("Recebido comando para ABRIR O PORTÃO.");
  
  // Lógica futura para acionar o hardware virá aqui.
  
  // Enviando uma resposta de sucesso para o frontend.
  res.status(200).json({ sucesso: true, message: "Sinal enviado para o portão!" });
});
// ===== FIM DA NOVA ROTA =====


// ===== CHAMADA PARA INICIAR O SERVIDOR (APENAS UMA VEZ) =====
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});