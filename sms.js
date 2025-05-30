// Importando o Twilio
const twilio = require('twilio');

// Suas credenciais do Twilio (substitua com suas credenciais reais)
const accountSid = 'your_account_sid';  // SID da sua conta
const authToken = 'your_auth_token';    // Token de autenticação

// Criação do cliente Twilio
const client = new twilio(accountSid, authToken);

// Função para enviar o SMS
function enviarSMS(numero, mensagem) {
  client.messages.create({
    body: mensagem,
    from: '+18777804236', // Substitua pelo seu número Twilio
    to: numero                   // Número de destino
  })
  .then(message => console.log('Mensagem enviada com sucesso: ' + message.sid))
  .catch(error => console.log('Erro ao enviar mensagem: ' + error));
}

// Teste da função
enviarSMS(+55 17 99979-3885, 'Seu código de confirmação é: 123456');
