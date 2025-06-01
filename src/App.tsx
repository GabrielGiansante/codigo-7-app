import './App.css';

import { useState } from 'react';

function App() {
  //const [showReservation, setShowReservation] = useState(false);
  //const [selectedDate, setSelectedDate] = useState('');
  //const [selectedTime, setSelectedTime] = useState('');
 // const [reservations, setReservations] = useState<any[]>([]);
  //const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('boasVindas');
  const [telefone, setTelefone] = useState('');
  const [codigoDigitado, setCodigoDigitado] = useState('');

  // Função que lida com o clique no botão de reserva
  //const handleReservationClick = () => {
  //  setShowReservation(true); // Exibe o formulário de reserva
 // };

  // Função para simular a confirmação do pagamento
  //const confirmPayment = () => {
   // alert("Pagamento confirmado! A reserva será finalizada.");
   // setPaymentConfirmed(true);
 // };

  // Função para salvar a reserva no localStorage
  //const handleSubmit = (event: React.FormEvent) => {
    //event.preventDefault();
   // if (selectedDate && selectedTime && paymentConfirmed) {
   //   const newReservation = { date: selectedDate, time: selectedTime };
   //   const updatedReservations = [...reservations, newReservation];
   //   localStorage.setItem('reservations', JSON.stringify(updatedReservations));
   //   setReservations(updatedReservations);
    //  alert('Reserva Confirmada!');
     // setShowReservation(false);
    //} else if (!paymentConfirmed) {
   //   alert('Você precisa confirmar o pagamento para finalizar a reserva.');
  //  } else {
   //   alert('Por favor, preencha todos os campos!');
   // }
  //};

  const handleEnviarTelefone = async () => {
    if (!telefone.trim()) {
      alert("Por favor, digite seu número de telefone.");
      return;
    }
    const numeroCompleto = "+55" + telefone.trim();
    console.log("Enviando número:", numeroCompleto);
    try {
      const response = await fetch("https://codigo-7-app-3.onrender.com/enviar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: numeroCompleto }),
      });
      const data = await response.json();
      if (data.sucesso) {
        alert("Código enviado! Verifique seu celular.");
        setCurrentScreen('verificacaoCodigo');
      } else {
        alert("Erro ao enviar o código: " + (data.erro || 'Erro desconhecido do servidor'));
      }
    } catch (error: any) {
      console.error("Erro de comunicação com o servidor:", error);
      alert("Erro de comunicação com o servidor: " + error.message);
    }
  };

  const handleVerificarCodigo = async () => {
    if (!codigoDigitado.trim()) {
      alert("Por favor, insira o código.");
      return;
    }
    console.log("Verificando código:", codigoDigitado.trim());
    try {
      const response = await fetch("https://codigo-7-app-3.onrender.com/verificar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: codigoDigitado.trim() }),
      });
      const data = await response.json();
      if (data.sucesso) {
        alert("Código confirmado com sucesso!");
        setCurrentScreen('areaDeReserva');
      } else {
        alert("Código incorreto. Tente novamente.");
      }
    } catch (error: any) {
      console.error("Erro ao verificar o código:", error);
      alert("Erro ao verificar o código: " + error.message);
    }
  };

  //useEffect(() => {
    //const storedReservations = localStorage.getItem('reservations');
   // if (storedReservations) {
     // setReservations(JSON.parse(storedReservations));
   // }
  //}, []);

  // const isDateAvailable = ... (comentado)

  console.log("Tela atual ANTES do return:", currentScreen);


  return (
    <div style={{
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>

      {currentScreen === 'boasVindas' && (
        <>
          {console.log("DENTRO do bloco boasVindas")}
          <h1>Bem-vindo ao Código 7!</h1>
          <p>Sua plataforma de aluguel de áreas de lazer.</p>
          <button onClick={() => setCurrentScreen('cadastroTelefone')}>
            Iniciar Cadastro
          </button>
        </>
      )}

      {currentScreen === 'cadastroTelefone' && (
        <>
          {console.log("DENTRO do bloco cadastroTelefone")}
          <h1>Digite seu número de telefone</h1>
          <p style={{ color: '#aaa', fontSize: '1.1em', marginBottom: '20px' }}>
            Seu número é usado apenas para confirmar seu acesso. Não enviamos mensagens. Garantimos sigilo absoluto.
          </p>
          <input
            type="tel"
            id="telefoneInput"
            placeholder="Seu DDD + Número (ex: 11987654321)"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            style={{ padding: '10px', fontSize: '1em', marginBottom: '1.5em', width: '250px' }}
          />
          <button onClick={handleEnviarTelefone}>
            Continuar
          </button>
        </>
      )}

      {currentScreen === 'verificacaoCodigo' && (
        <>
          {console.log("DENTRO do bloco verificacaoCodigo")}
          <h1>Insira o código recebido</h1>
          <input
            type="text"
            id="codigoInput"
            placeholder="Digite o código"
            value={codigoDigitado}
            onChange={(e) => setCodigoDigitado(e.target.value)}
            style={{ padding: '10px', fontSize: '1em', marginBottom: '1.5em', width: '200px' }}
          />
          <button onClick={handleVerificarCodigo}>
            Confirmar
          </button>
        </>
      )}

      {currentScreen === 'areaDeReserva' && (
        <>
          {console.log("DENTRO do bloco areaDeReserva")}
          <h2>Área de Reserva</h2>
        </>

      )}
    </div>
  );
}


export default App;


