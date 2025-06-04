import './App.css';
import { useState, useEffect } from 'react';

function App() {
  // Estados da "Sala Preta" original - MANTIDOS COMENTADOS
  // const [showReservation, setShowReservation] = useState(false); 
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Estados do fluxo "Código 7" e da nova lógica de reserva
  const [currentScreen, setCurrentScreen] = useState('boasVindas');
  const [telefone, setTelefone] = useState('');
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [opcaoAluguel, setOpcaoAluguel] = useState('4h');
  const [totalHorasCustom, setTotalHorasCustom] = useState(13);
  const [horarioSaida, setHorarioSaida] = useState('');
  const [precoFinal, setPrecoFinal] = useState(600);

  // Funções da "Sala Preta" original - MANTIDAS COMENTADAS, EXCETO AS USADAS
  // const handleReservationClick = () => {
  //   setShowReservation(true); 
  // };

  const confirmPayment = () => {
    alert("Pagamento confirmado! A reserva será finalizada.");
    setPaymentConfirmed(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedDate && selectedTime && paymentConfirmed) {
      const newReservation = { 
        date: selectedDate, 
        time: selectedTime, 
        option: opcaoAluguel, 
        totalHours: opcaoAluguel === 'custom' ? totalHorasCustom : (opcaoAluguel === '4h' ? 4 : 12), 
        price: precoFinal 
      };
      const updatedReservations = [...reservations, newReservation];
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      alert('Reserva Confirmada!');
      setCurrentScreen('boasVindas'); 
      setSelectedDate('');
      setSelectedTime('');
      setOpcaoAluguel('4h');
      setTotalHorasCustom(13);
      setPaymentConfirmed(false);
      setPrecoFinal(600); 
      setHorarioSaida('');
    } else if (!paymentConfirmed) {
      alert('Você precisa confirmar o pagamento para finalizar a reserva.');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios (Data e Hora de Entrada)!');
    }
  };

  // Funções do fluxo "Código 7"
  const handleEnviarTelefone = async () => {
    if (!telefone.trim()) {
      alert("Por favor, digite seu número de telefone.");
      return;
    }
    const numeroCompleto = "+55" + telefone.trim();
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
    alert("MODO TESTE: Indo direto para a reserva!");
setCurrentScreen('areaDeReserva');
return;
    if (!codigoDigitado.trim()) {
      alert("Por favor, insira o código.");
      return;
    }
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

  // useEffect para carregar reservas do localStorage
  useEffect(() => {
    const storedReservations = localStorage.getItem('reservations');
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }
  }, []);

  // useEffect para calcular preço e horário de saída
  useEffect(() => {
    const calcularReserva = () => {
      let novoPreco = 0;
      let novoHorarioSaida = '';

      if (selectedTime) { 
        const [horasEntradaStr, minutosEntradaStr] = selectedTime.split(':');
        const horasEntrada = parseInt(horasEntradaStr, 10);
        const minutosEntrada = parseInt(minutosEntradaStr, 10);
        
        let horasSaidaCalc = horasEntrada;
        let minutosSaidaCalc = minutosEntrada; // CORRIGIDO: Usa a variável que foi parseada

        if (opcaoAluguel === '4h') {
          novoPreco = 600;
          horasSaidaCalc += 4;
        } else if (opcaoAluguel === '12h') {
          novoPreco = 1200;
          horasSaidaCalc += 12;
        } else if (opcaoAluguel === 'custom') {
          const horasParaCalculo = (totalHorasCustom === 0 || totalHorasCustom < 13) ? 13 : totalHorasCustom;
          novoPreco = 1200 + (horasParaCalculo - 12) * 100;
          horasSaidaCalc += horasParaCalculo;
        }

        if (horasSaidaCalc >= 24) {
          horasSaidaCalc = horasSaidaCalc % 24; 
        }
        
        const horaFormatada = String(horasSaidaCalc).padStart(2, '0');
        const minutoFormatado = String(minutosSaidaCalc).padStart(2, '0'); // CORRIGIDO: Usa a variável correta
        novoHorarioSaida = `${horaFormatada}:${minutoFormatado}`;
      } else {
        if (opcaoAluguel === '4h') novoPreco = 600;
        else if (opcaoAluguel === '12h') novoPreco = 1200;
        else if (opcaoAluguel === 'custom') {
            const horasParaCalculo = (totalHorasCustom === 0 || totalHorasCustom < 13) ? 13 : totalHorasCustom;
            novoPreco = 1200 + (horasParaCalculo - 12) * 100;
        }
      }
      setPrecoFinal(novoPreco);
      setHorarioSaida(selectedTime ? novoHorarioSaida : '');
    };
    calcularReserva();
  }, [selectedTime, opcaoAluguel, totalHorasCustom]);

  // const isDateAvailable = ... (comentado)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start', 
      paddingTop: '0px',            // <<< ZERAR TEMPORARIAMENTE PARA VER EFEITO PURO
      paddingBottom: '40px'        // ADICIONADO: para dar espaço ao rolar até o final
    }}>
      {currentScreen === 'boasVindas' && (
        <div className="container"> 
          <h1>Código 7</h1> 
          <p className="jargao">Discrição. Comodidade. Praticidade.</p> 
          <button onClick={() => setCurrentScreen('cadastroTelefone')}>
            Entrar 
          </button>
        </div>
      )}

      {currentScreen === 'cadastroTelefone' && (
        <div className="cadastro-container"> 
          <h1>Digite seu número de telefone</h1>
          <p className="cadastro-info-paragrafo"> 
            Seu número é usado apenas para confirmar seu acesso. Não enviamos mensagens. Garantimos sigilo absoluto.
          </p>
          <input
            type="tel"
            placeholder="Seu DDD + Número (ex: 11987654321)"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <button onClick={handleEnviarTelefone}>
            Continuar
          </button>
        </div>
      )}

      {currentScreen === 'verificacaoCodigo' && (
        <div className="cadastro-container"> 
          <h1>Insira o código recebido</h1>
          <input
            type="text"
            id="codigoInput" 
            placeholder="Digite o código"
            value={codigoDigitado}
            onChange={(e) => setCodigoDigitado(e.target.value)}
            maxLength={6}
          />
          <button onClick={handleVerificarCodigo}>
          
            Confirmar
          </button>
        </div>
      )}

      {currentScreen === 'areaDeReserva' && (
        <>
          <div className="area-reserva-container">
            <h1>Faça Sua Reserva</h1>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }} onSubmit={handleSubmit}>
              <label htmlFor="reservaData" className="cadastro-info-paragrafo" style={{ textAlign: 'left', marginBottom: '2px' }}>
                Data da Reserva:
              </label>
              <input
                type="date"
                id="reservaData"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <label htmlFor="reservaHoraEntrada" className="cadastro-info-paragrafo" style={{ textAlign: 'left', marginBottom: '2px' }}>
                Hora de Entrada:
              </label>
              <input
                type="time"
                id="reservaHoraEntrada"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
              <div className="cadastro-info-paragrafo" style={{ textAlign: 'left', marginTop: '15px', marginBottom: '5px' }}>Selecione a Duração:</div>
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <div>
                  <input type="radio" id="opcao4h" name="opcaoAluguel" value="4h" checked={opcaoAluguel === '4h'} onChange={(e) => setOpcaoAluguel(e.target.value)} />
                  <label htmlFor="opcao4h" style={{ color: '#FFF', marginLeft: '5px' }}>4 Horas - R$ 600,00</label>
                </div>
                <div>
                  <input type="radio" id="opcao12h" name="opcaoAluguel" value="12h" checked={opcaoAluguel === '12h'} onChange={(e) => setOpcaoAluguel(e.target.value)} />
                  <label htmlFor="opcao12h" style={{ color: '#FFF', marginLeft: '5px' }}>12 Horas - R$ 1.200,00</label>
                </div>
                <div>
                  <input type="radio" id="opcaoCustom" name="opcaoAluguel" value="custom" checked={opcaoAluguel === 'custom'} onChange={(e) => setOpcaoAluguel(e.target.value)} />
                  <label htmlFor="opcaoCustom" style={{ color: '#FFF', marginLeft: '5px' }}>Acima de 12 Horas (R$ 100,00/hora adicional)</label>
                </div>
              </div>
              {opcaoAluguel === 'custom' && (
                <>
                  <label htmlFor="totalHorasCustomInput" className="cadastro-info-paragrafo" style={{ textAlign: 'left', marginBottom: '2px' }}>
                    Total de Horas Desejado:
                  </label>
                  <input
                    type="number"
                    id="totalHorasCustomInput"
                    min="13"
                    value={totalHorasCustom.toString()}
                    onChange={(e) => {
                      const stringValue = e.target.value;
                      if (stringValue === '') {
                        setTotalHorasCustom(0); 
                      } else {
                        const numValue = parseInt(stringValue);
                        if (!isNaN(numValue)) {
                          setTotalHorasCustom(numValue);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (totalHorasCustom < 13 && totalHorasCustom !== 0) {
                        setTotalHorasCustom(13);
                      } else if (totalHorasCustom === 0) {
                        setTotalHorasCustom(13);
                      }
                    }}
                  />
                </>
              )}
              <label htmlFor="reservaHoraSaida" className="cadastro-info-paragrafo" style={{ textAlign: 'center', color: '#00BFFF', fontWeight: 'bold', fontSize: '1.1em', display: 'block', marginBottom: '5px', marginTop: '20px' }}>
                Hora de Saída (Estimada):
              </label>
              <input
                type="time"
                id="reservaHoraSaida"
                value={horarioSaida}
                readOnly
                style={{ backgroundColor: '#1F1F1F', color: '#FFA500', border: '1px dashed #555', padding: '10px', borderRadius: '8px', fontSize: '1.5em', textAlign: 'center', width: '50%', minWidth: '120px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5em', cursor: 'default' }}
              />
              <div className="cadastro-info-paragrafo" style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2em' }}>
                Preço Total Estimado: R$ {precoFinal.toFixed(2).replace('.', ',')}
              </div>
              <button type="button" onClick={confirmPayment} style={{ marginTop: '20px' }}>
                Confirmar Pagamento
              </button>
              {paymentConfirmed && (
                <button type="submit">
                  Finalizar Reserva
                </button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default App;