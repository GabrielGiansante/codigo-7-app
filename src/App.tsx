import './App.css';
import { useState, useEffect } from 'react';
const itensConsumoDisponiveis = [
  { id: 'coca', nome: 'Coca-Cola (lata 350ml)', preco: 8.00, categoria: 'Bebidas' },
  { id: 'agua_sem_gas', nome: 'Água Mineral s/ Gás (500ml)', preco: 5.00, categoria: 'Bebidas' },
  { id: 'heineken_ln', nome: 'Cerveja Heineken (long neck)', preco: 12.00, categoria: 'Bebidas Alcoólicas' },
  { id: 'mini_salgados', nome: 'Porção Mini Salgados (12 un.)', preco: 30.00, categoria: 'Comidas' },
  // Adicione sua lista completa aqui
];

function App() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('areaDeReserva');
  const [telefone, setTelefone] = useState('');
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [opcaoAluguel, setOpcaoAluguel] = useState('4h');
  const [totalHorasCustom, setTotalHorasCustom] = useState(13);
  const [horarioSaida, setHorarioSaida] = useState('');
  const [precoFinal, setPrecoFinal] = useState(600);
  const [itensConsumoSelecionados, setItensConsumoSelecionados] = useState<{ [itemId: string]: number }>({});

  const handleSelecionarItem = (itemId: string, operacao: 'incrementar' | 'decrementar') => {
    setItensConsumoSelecionados(prevSelecionados => {
      const quantidadeAtual = prevSelecionados[itemId] || 0;
      const novaQuantidade = operacao === 'incrementar' ? quantidadeAtual + 1 : quantidadeAtual - 1;
  
      if (novaQuantidade <= 0) {
        const { [itemId]: _, ...novosSelecionados } = prevSelecionados;
        return novosSelecionados;
      } else {
        return { ...prevSelecionados, [itemId]: novaQuantidade };
      }
    });
  };
  const confirmPayment = () => {
    alert("Pagamento confirmado! A reserva será finalizada.");
    setPaymentConfirmed(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedDate && selectedTime && paymentConfirmed) {
      const newReservation = {
        date: selectedDate, time: selectedTime, option: opcaoAluguel,
        totalHours: opcaoAluguel === 'custom' ? totalHorasCustom : (opcaoAluguel === '4h' ? 4 : 12),
        price: precoFinal
      };
      const updatedReservations = [...reservations, newReservation];
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      alert('Reserva Confirmada!');
      setCurrentScreen('boasVindas');
      setSelectedDate(''); setSelectedTime(''); setOpcaoAluguel('4h');
      setTotalHorasCustom(13); setPaymentConfirmed(false);
      setPrecoFinal(600); setHorarioSaida('');
    } else if (!paymentConfirmed) {
      alert('Você precisa confirmar o pagamento para finalizar a reserva.');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios (Data e Hora de Entrada)!');
    }
  };

  const handleEnviarTelefone = async () => {
    if (!telefone.trim()) {
      alert("Por favor, digite seu número de telefone."); return;
    }
    const numeroCompleto = "+55" + telefone.trim();
    try {
      const response = await fetch("https://codigo-7-app-3.onrender.com/enviar-codigo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: numeroCompleto }),
      });
      const data = await response.json();
      if (data.sucesso) {
        alert("Código enviado! Verifique seu celular."); setCurrentScreen('verificacaoCodigo');
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
  };

  useEffect(() => {
    const storedReservations = localStorage.getItem('reservations');
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }
  }, []);

  useEffect(() => {
    const calcularReserva = () => {
      let novoPreco = 0; let novoHorarioSaida = '';
      if (selectedTime) {
        const [horasEntradaStr, minutosEntradaStr] = selectedTime.split(':');
        const horasEntrada = parseInt(horasEntradaStr, 10);
        const minutosEntrada = parseInt(minutosEntradaStr, 10);
        let horasSaidaCalc = horasEntrada; let minutosSaidaCalc = minutosEntrada;
        if (opcaoAluguel === '4h') { novoPreco = 600; horasSaidaCalc += 4; }
        else if (opcaoAluguel === '12h') { novoPreco = 1200; horasSaidaCalc += 12; }
        else if (opcaoAluguel === 'custom') {
          const horasParaCalculo = (totalHorasCustom === 0 || totalHorasCustom < 13) ? 13 : totalHorasCustom;
          novoPreco = 1200 + (horasParaCalculo - 12) * 100; horasSaidaCalc += horasParaCalculo;
        }
        if (horasSaidaCalc >= 24) { horasSaidaCalc = horasSaidaCalc % 24; }
        const horaFormatada = String(horasSaidaCalc).padStart(2, '0');
        const minutoFormatado = String(minutosSaidaCalc).padStart(2, '0');
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

  useEffect(() => {
    if (currentScreen === 'areaDeReserva') {
      window.scrollTo(0, 0);
      console.log("Rolou para o topo - areaDeReserva");
    }
  }, [currentScreen]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      paddingTop: '40px', paddingBottom: '40px', boxSizing: 'border-box'
    }}>
      {currentScreen === 'boasVindas' && (
        <div className="container">
          <h1>Código 7</h1>
          <p className="jargao">Discrição. Comodidade. Praticidade.</p>
          <button onClick={() => setCurrentScreen('cadastroTelefone')}>Entrar</button>
        </div>
      )}

      {currentScreen === 'cadastroTelefone' && (
        <div className="cadastro-container">
          <h1>Digite seu número de telefone</h1>
          <p className="cadastro-info-paragrafo">
            Seu número é usado apenas para confirmar seu acesso. Não enviamos mensagens. Garantimos sigilo absoluto.
          </p>
          <input type="tel" placeholder="Seu DDD + Número (ex: 11987654321)" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <button onClick={handleEnviarTelefone}>Continuar</button>
        </div>
      )}

      {currentScreen === 'verificacaoCodigo' && (
        <div className="cadastro-container">
          <h1>Insira o código recebido</h1>
          <input type="text" id="codigoInput" placeholder="Digite o código" value={codigoDigitado} onChange={(e) => setCodigoDigitado(e.target.value)} maxLength={6} />
          <button onClick={handleVerificarCodigo}>Confirmar</button>
        </div>
      )}

      {currentScreen === 'areaDeReserva' && (
        <>
          <div className="area-reserva-container">
            <h1>Faça Sua Reserva</h1>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }} onSubmit={handleSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                <label htmlFor="reservaData" className="form-label-inline">Data da Reserva:</label>
                <input type="date" id="reservaData" className="form-input-inline" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="reservaHoraEntrada" className="form-label-inline">Hora de Entrada:</label>
                <input type="time" id="reservaHoraEntrada" className="form-input-inline form-input-time-inline" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
              </div>

              {/* SEÇÃO DE DURAÇÃO MODIFICADA */}
              <div className="form-section-title"> {/* << CLASSE ALTERADA AQUI */}
                Selecione a Duração:
              </div>
              <div className="opcoes-duracao-container">
                <div className="opcao-duracao-item">
                  <input className="radio-grande" type="radio" id="opcao4h" name="opcaoAluguel" value="4h" checked={opcaoAluguel === '4h'} onChange={(e) => setOpcaoAluguel(e.target.value)} />
                  <label htmlFor="opcao4h" className="label-radio-grande">4 Horas - R$ 600,00</label>
                </div>
                <div className="opcao-duracao-item">
                  <input className="radio-grande" type="radio" id="opcao12h" name="opcaoAluguel" value="12h" checked={opcaoAluguel === '12h'} onChange={(e) => setOpcaoAluguel(e.target.value)} />
                  <label htmlFor="opcao12h" className="label-radio-grande">12 Horas - R$ 1.200,00</label>
                </div>
                <div className="opcao-duracao-item">
                  <input className="radio-grande" type="radio" id="opcaoCustom" name="opcaoAluguel" value="custom" checked={opcaoAluguel === 'custom'} onChange={(e) => setOpcaoAluguel(e.target.value)} />
                  <label htmlFor="opcaoCustom" className="label-radio-grande">Acima de 12 Horas (R$ 100,00/hora adicional)</label>
                </div>
              </div>
              {/* FIM DA SEÇÃO DE DURAÇÃO MODIFICADA */}

              {opcaoAluguel === 'custom' && (
                <>
                  {/* Mantendo a classe original para este label específico, se o estilo for diferente */}
                  <label htmlFor="totalHorasCustomInput" className="cadastro-info-paragrafo" style={{ textAlign: 'left', marginBottom: '2px' }}>Total de Horas Desejado:</label>
                  <input type="number" id="totalHorasCustomInput" min="13" value={totalHorasCustom.toString()}
                    onChange={(e) => {
                      const stringValue = e.target.value;
                      if (stringValue === '') { setTotalHorasCustom(0); }
                      else { const numValue = parseInt(stringValue); if (!isNaN(numValue)) { setTotalHorasCustom(numValue); } }
                    }}
                    onBlur={() => {
                      if (totalHorasCustom < 13 && totalHorasCustom !== 0) { setTotalHorasCustom(13); }
                      else if (totalHorasCustom === 0) { setTotalHorasCustom(13); }
                    }}
                    style={{ padding: '8px', fontSize: '0.9em', borderRadius: '6px', border: '1px solid #555', width: '100%', boxSizing: 'border-box', backgroundColor: '#2a2a2a', color: '#fff' }}
                  />
                </>
              )}
              <label htmlFor="reservaHoraSaida" className="cadastro-info-paragrafo" style={{ textAlign: 'center', color: '#00BFFF', fontWeight: 'bold', fontSize: '1.1em', display: 'block', marginBottom: '5px', marginTop: '20px' }}>Hora de Saída:</label>
              <input type="time" id="reservaHoraSaida" value={horarioSaida} readOnly style={{ backgroundColor: '#1F1F1F', color: '#FFA500', border: '1px dashed #555', padding: '10px', borderRadius: '8px', fontSize: '1.5em', textAlign: 'center', width: '50%', minWidth: '120px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5em', cursor: 'default' }} />
              <div className="cadastro-info-paragrafo" style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2em' }}>Preço Total Estimado: R$ {precoFinal.toFixed(2).replace('.', ',')}</div>
              <button type="button" onClick={confirmPayment} style={{ marginTop: '20px' }}>Confirmar Pagamento</button>
              {paymentConfirmed && (<button type="submit">Finalizar Reserva</button>)}
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default App;