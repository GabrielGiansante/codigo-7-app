import './App.css';
import { useState, useEffect } from 'react';

// LISTA DE ITENS DE CONSUMO
const itensConsumoDisponiveis = [
  // Carnes
  { id: 'picanha', nome: 'Picanha (aprox. 500g)', preco: 70.00, categoria: 'Carnes' },
  { id: 'maminha', nome: 'Maminha (aprox. 500g)', preco: 60.00, categoria: 'Carnes' },
  { id: 'linguica_churras', nome: 'Linguiça Toscana (500g)', preco: 25.00, categoria: 'Carnes' },
  // ... (e todos os outros itens que você já tinha)
  { id: 'velho_barreiro', nome: 'Cachaça Velho Barreiro (dose)', preco: 10.00, categoria: 'Destilados' },
];

function App() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('areaDeReserva');
  const [opcaoAluguel, setOpcaoAluguel] = useState('4h');
  const [totalHorasCustom, setTotalHorasCustom] = useState(13);
  const [horarioSaida, setHorarioSaida] = useState('');
  const [precoFinal, setPrecoFinal] = useState(600);
  const [itensConsumoSelecionados, setItensConsumoSelecionados] = useState<{ [itemId: string]: number }>({});

  const handleConfirmarPagamento = () => {
    setCurrentScreen('areaDePagamento');
  };

  const handlePagamentoRealizado = () => {
    alert("Pagamento confirmado! Liberando seu acesso.");
    localStorage.setItem('acessoLiberado', 'true');
    setPaymentConfirmed(true);
    setCurrentScreen('telaControleRemoto');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedDate && selectedTime && paymentConfirmed) {
      const newReservation = {
        date: selectedDate, time: selectedTime, option: opcaoAluguel,
        totalHours: opcaoAluguel === 'custom' ? totalHorasCustom : (opcaoAluguel === '4h' ? 4 : 12),
        price: precoFinal,
        itensConsumidos: itensConsumoSelecionados
      };
      const updatedReservations = [...reservations, newReservation];
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      alert('Reserva Confirmada!');
      // Ao invés de ir para boasVindas, talvez devêssemos limpar o acesso e ir para lá
      localStorage.removeItem('acessoLiberado');
      setCurrentScreen('boasVindas'); // Por enquanto, mantemos isso.
      // Resetar estados
      setSelectedDate(''); setSelectedTime(''); setOpcaoAluguel('4h');
      setTotalHorasCustom(13); setPaymentConfirmed(false);
      setPrecoFinal(600); setHorarioSaida('');
      setItensConsumoSelecionados({});
    }
  };

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

  useEffect(() => {
    const acessoJaLiberado = localStorage.getItem('acessoLiberado');
    if (acessoJaLiberado === 'true') {
      setCurrentScreen('telaControleRemoto');
    } else {
      const storedReservations = localStorage.getItem('reservations');
      if (storedReservations) {
        setReservations(JSON.parse(storedReservations));
      }
    }
  }, []);

  useEffect(() => {
    // ... (lógica de calcularReserva, inalterada) ...
  }, [selectedTime, opcaoAluguel, totalHorasCustom, itensConsumoSelecionados]);

  useEffect(() => {
    if (currentScreen === 'areaDeReserva' || currentScreen === 'areaDePagamento') {
      window.scrollTo(0, 0);
    }
  }, [currentScreen]);

  const categoriasUnicas = Array.from(new Set(itensConsumoDisponiveis.map(item => item.categoria)));
  categoriasUnicas.sort((a, b) => {
    const ordemFixa: { [key: string]: number } = {
        'Carnes': 1, 'Queijos e Frios': 2, 'Acompanhamentos': 3, 'Para Pizza': 4,
        'Snacks': 5, 'Bebidas não Alcoólicas': 6, 'Cervejas': 7, 'Vinhos': 8,
        'Destilados': 9, 'Outros': 10, 'Adicionais': 11
    };
    return (ordemFixa[a] || 99) - (ordemFixa[b] || 99);
  });
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      paddingTop: '40px', paddingBottom: '40px', boxSizing: 'border-box'
    }}>
      {/* Telas antigas removidas para evitar erros de build */}

      {currentScreen === 'areaDeReserva' && (
        <div className="area-reserva-container">
          <h1>Faça Sua Reserva</h1>
          <form style={{ display: 'flex', flexDirection: 'column', width: '100%' }} onSubmit={handleSubmit}>
            {/* ... Seções de Data, Hora, Duração ... */}
            {/* ... Seção de Itens de Consumo ... */}
            
            <label htmlFor="reservaHoraSaida" className="form-section-title" style={{ textAlign: 'center', color: '#00BFFF', marginTop: '15px', marginBottom: '5px' }}>Hora de Saída:</label>
            <input type="time" id="reservaHoraSaida" value={horarioSaida} readOnly style={{ backgroundColor: '#1F1F1F', color: '#FFA500', border: '1px dashed #555', padding: '10px', borderRadius: '8px', fontSize: '1.5em', textAlign: 'center', width: '50%', minWidth: '120px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5em', cursor: 'default' }} />
            
            <div className="form-section-title" style={{textAlign: 'center', fontSize: '1.3em', marginTop: '10px' }}>Preço Total Estimado: R$ {precoFinal.toFixed(2).replace('.', ',')}</div>
            
            <div style={{marginTop: '20px'}}>
              <button type="button" onClick={handleConfirmarPagamento}>
                Ir para Pagamento
              </button>
              {paymentConfirmed && (
                <button type="submit" style={{marginTop: '10px'}}>
                  Finalizar Reserva
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {currentScreen === 'areaDePagamento' && (
        <div className="pagamento-container">
          <h1>Pagamento via Pix</h1>
          <p className="pagamento-info">
            Para liberar seu acesso, realize o pagamento de <strong>R$ {precoFinal.toFixed(2).replace('.', ',')}</strong>.
          </p>
          <div className="pix-section">
            <p>Use o Pix Copia e Cola para realizar o pagamento:</p>
            <div className="pix-copia-cola">
              <span>SEU_CODIGO_PIX_COPIA_E_COLA_AQUI</span>
              <button 
                type="button" 
                onClick={() => {
                  navigator.clipboard.writeText('SEU_CODIGO_PIX_COPIA_E_COLA_AQUI');
                  alert('Código Pix copiado!');
                }}
              >
                Copiar
              </button>
            </div>
          </div>
          <div className="pagamento-aviso">
            <p><strong>IMPORTANTE:</strong> Após realizar o pagamento, <strong>retorne a esta tela</strong> e clique no botão abaixo para liberar seu acesso.</p>
          </div>
          <button 
            className="btn-pagamento-confirmado" 
            onClick={handlePagamentoRealizado}
          >
            Já Paguei, Liberar Acesso
          </button>
          <button 
            className="btn-pagamento-voltar" 
            onClick={() => setCurrentScreen('areaDeReserva')}
          >
            Voltar e Alterar Pedido
          </button>
        </div>
      )}

      {currentScreen === 'telaControleRemoto' && (
        <div className="controle-container">
          <h1>Acesso Liberado</h1>
          <p>Use os botões abaixo para controlar o portão.</p>
          <div className="controle-botoes">
            <button className="btn-controle btn-abrir">Abrir Portão</button>
            <button 
              className="btn-controle btn-nova-reserva" 
              onClick={() => {
                localStorage.removeItem('acessoLiberado');
                // Limpar todos os estados da reserva antes de voltar
                setSelectedDate(''); setSelectedTime(''); setOpcaoAluguel('4h');
                setTotalHorasCustom(13); setPaymentConfirmed(false);
                setPrecoFinal(600); setHorarioSaida('');
                setItensConsumoSelecionados({});
                setCurrentScreen('areaDeReserva'); // Volta para a reserva
              }}
            >
              Fazer Nova Reserva
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;