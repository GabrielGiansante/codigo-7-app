import './App.css';
import { useState, useEffect } from 'react';

// LISTA DE ITENS DE CONSUMO
const itensConsumoDisponiveis = [
  // Carnes
  { id: 'picanha', nome: 'Picanha (aprox. 500g)', preco: 70.00, categoria: 'Carnes' },
  { id: 'maminha', nome: 'Maminha (aprox. 500g)', preco: 60.00, categoria: 'Carnes' },
  { id: 'linguica_churras', nome: 'Linguiça Toscana (500g)', preco: 25.00, categoria: 'Carnes' },
  // Queijos e Frios
  { id: 'gorgonzola', nome: 'Queijo Gorgonzola (150g)', preco: 28.00, categoria: 'Queijos e Frios' },
  { id: 'mussarela_fatiada', nome: 'Mussarela Fatiada (200g)', preco: 18.00, categoria: 'Queijos e Frios' },
  { id: 'presunto_fatiado', nome: 'Presunto Fatiado (200g)', preco: 15.00, categoria: 'Queijos e Frios' },
  // Acompanhamentos
  { id: 'pao_de_alho', nome: 'Pão de Alho (unidade)', preco: 8.00, categoria: 'Acompanhamentos' },
  { id: 'arroz_branco', nome: 'Porção de Arroz Branco', preco: 15.00, categoria: 'Acompanhamentos' },
  { id: 'farinha_temperada', nome: 'Farinha Temperada (pacote)', preco: 10.00, categoria: 'Acompanhamentos' },
  { id: 'mandioca_cozida', nome: 'Porção de Mandioca Cozida', preco: 20.00, categoria: 'Acompanhamentos' },
  { id: 'azeitona_verde', nome: 'Azeitonas Verdes (pote)', preco: 12.00, categoria: 'Acompanhamentos' },
  { id: 'milho_ervilha', nome: 'Milho e Ervilha (lata)', preco: 7.00, categoria: 'Acompanhamentos' },
  { id: 'palmito_pupunha', nome: 'Palmito Pupunha (vidro)', preco: 25.00, categoria: 'Acompanhamentos' },
  { id: 'ovo_cozido', nome: 'Ovo Cozido (unidade)', preco: 3.00, categoria: 'Acompanhamentos' },
  // Pizza (Componentes)
  { id: 'massa_pizza_brotinho', nome: 'Massa de Pizza (brotinho)', preco: 10.00, categoria: 'Para Pizza' },
  // Snacks
  { id: 'torcida_pimenta', nome: 'Salgadinho Torcida Pimenta Mexicana', preco: 6.00, categoria: 'Snacks' },
  { id: 'torcida_queijo', nome: 'Salgadinho Torcida Queijo', preco: 6.00, categoria: 'Snacks' },
  { id: 'torcida_cebola', nome: 'Salgadinho Torcida Cebola', preco: 6.00, categoria: 'Snacks' },
  // Outros
  { id: 'tomate_un', nome: 'Tomate (unidade)', preco: 2.00, categoria: 'Outros' },
  { id: 'cebola_un', nome: 'Cebola (unidade)', preco: 2.00, categoria: 'Outros' },
  { id: 'pimenta_dedo_moca', nome: 'Pimenta Dedo de Moça (porção)', preco: 5.00, categoria: 'Outros' },
  { id: 'limao_un', nome: 'Limão Tahiti (unidade)', preco: 1.50, categoria: 'Outros' },
  // Bebidas não Alcoólicas
  { id: 'coca_cola_2l', nome: 'Coca-Cola (2L)', preco: 15.00, categoria: 'Bebidas não Alcoólicas' },
  { id: 'agua_300ml', nome: 'Água Mineral s/ Gás (300ml)', preco: 4.00, categoria: 'Bebidas não Alcoólicas' },
  // Cervejas
  { id: 'heineken_ln', nome: 'Cerveja Heineken (long neck)', preco: 12.00, categoria: 'Cervejas' },
  { id: 'eisenbahn_pilsen_ln', nome: 'Cerveja Eisenbahn Pilsen (long neck)', preco: 10.00, categoria: 'Cervejas' },
  { id: 'stella_artois_ln', nome: 'Cerveja Stella Artois (long neck)', preco: 11.00, categoria: 'Cervejas' },
  { id: 'budweiser_ln', nome: 'Cerveja Budweiser (long neck)', preco: 10.00, categoria: 'Cervejas' },
  // Vinhos
  { id: 'vinho_tinto_seco_nac', nome: 'Vinho Tinto Seco Nacional (garrafa)', preco: 45.00, categoria: 'Vinhos' },
  { id: 'vinho_branco_seco_nac', nome: 'Vinho Branco Seco Nacional (garrafa)', preco: 45.00, categoria: 'Vinhos' },
  // Destilados
  { id: 'red_label', nome: 'Whisky J.W. Red Label (dose)', preco: 25.00, categoria: 'Destilados' },
  { id: 'black_label', nome: 'Whisky J.W. Black Label (dose)', preco: 35.00, categoria: 'Destilados' },
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
  const [horasParaEstender, setHorasParaEstender] = useState(1);
  const [precoExtensao, setPrecoExtensao] = useState(100);

  // ===== FUNÇÃO CONFIRMPAYMENT ATUALIZADA COM A VALIDAÇÃO =====
  const confirmPayment = () => {
    // Verifica se a data e a hora foram selecionadas
    if (!selectedDate || !selectedTime) {
      alert("Por favor, selecione a Data e a Hora de Entrada antes de prosseguir para o pagamento.");
      return; // Impede a navegação para a tela de pagamento
    }
    
    // Se a data e hora estiverem preenchidas, continua para a tela de pagamento
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
      localStorage.removeItem('acessoLiberado');
      setCurrentScreen('areaDeReserva');
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novaDataStr = e.target.value;
    if (!novaDataStr) {
      setSelectedDate(''); setSelectedTime(''); return;
    }
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(novaDataStr);
    const dataSelecionadaAjustada = new Date(dataSelecionada.getUTCFullYear(), dataSelecionada.getUTCMonth(), dataSelecionada.getUTCDate());
    if (dataSelecionadaAjustada < hoje) {
      alert("Não é possível selecionar uma data passada.");
      setSelectedDate(''); setSelectedTime('');
    } else {
      setSelectedDate(novaDataStr);
      if (novaDataStr === hoje.toISOString().split('T')[0] && selectedTime) {
        handleTimeChange({ target: { value: selectedTime } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novaHora = e.target.value;
    const hoje = new Date();
    const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
    if (selectedDate === hojeStr && novaHora) {
      const horaAtual = hoje.getHours();
      const minutoAtual = hoje.getMinutes();
      const [horaSelecionada, minutoSelecionado] = novaHora.split(':').map(Number);
      if (horaSelecionada < horaAtual || (horaSelecionada === horaAtual && minutoSelecionado < minutoAtual)) {
        alert("Não é possível selecionar um horário passado para o dia de hoje.");
        setSelectedTime('');
        return;
      }
    }
    setSelectedTime(novaHora);
  };

  const handleAbrirPortao = async () => {
    try {
      const response = await fetch("https://codigo-7-app-3.onrender.com/abrir-portao", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro no servidor.");
      }
    } catch (error: any) {
      console.error("Erro ao tentar abrir o portão:", error);
      alert("Falha na comunicação com o portão: " + error.message);
    }
  };

  const handleConfirmarExtensao = () => {
    const conflito = false; // Placeholder
    if (conflito) {
      alert("Desculpe, o período solicitado para extensão não está disponível.");
      return;
    }
    setPrecoFinal(precoExtensao);
    setCurrentScreen('areaDePagamento');
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
    const calcularReserva = () => {
      if (currentScreen === 'areaDeReserva' || (currentScreen === 'areaDePagamento' && !paymentConfirmed)) {
        let novoPrecoAluguel = 0;
        if (opcaoAluguel === '4h') novoPrecoAluguel = 600;
        else if (opcaoAluguel === '12h') novoPrecoAluguel = 1200;
        else if (opcaoAluguel === 'custom') {
          const horasParaCalculo = (totalHorasCustom === 0 || totalHorasCustom < 13) ? 13 : totalHorasCustom;
          novoPrecoAluguel = 1200 + (horasParaCalculo - 12) * 100;
        }
        let precoItensConsumo = 0;
        for (const itemId in itensConsumoSelecionados) {
          const itemInfo = itensConsumoDisponiveis.find(item => item.id === itemId);
          if (itemInfo) {
            precoItensConsumo += itemInfo.preco * itensConsumoSelecionados[itemId];
          }
        }
        setPrecoFinal(novoPrecoAluguel + precoItensConsumo);
      }
      
      let novoHorarioSaida = '';
      if (selectedTime) {
        const [horasEntradaStr, minutosEntradaStr] = selectedTime.split(':');
        const horasEntrada = parseInt(horasEntradaStr, 10);
        const minutosEntrada = parseInt(minutosEntradaStr, 10);
        let horasSaidaCalc = horasEntrada; let minutosSaidaCalc = minutosEntrada;
        let totalHoras = 0;
        if (opcaoAluguel === '4h') totalHoras = 4;
        else if (opcaoAluguel === '12h') totalHoras = 12;
        else if (opcaoAluguel === 'custom') {
            totalHoras = (totalHorasCustom === 0 || totalHorasCustom < 13) ? 13 : totalHorasCustom;
        }
        horasSaidaCalc += totalHoras;
        if (horasSaidaCalc >= 24) horasSaidaCalc = horasSaidaCalc % 24;
        const horaFormatada = String(horasSaidaCalc).padStart(2, '0');
        const minutoFormatado = String(minutosSaidaCalc).padStart(2, '0');
        novoHorarioSaida = `${horaFormatada}:${minutoFormatado}`;
      }
      setHorarioSaida(selectedTime ? novoHorarioSaida : '');
    };
    calcularReserva();
  }, [selectedTime, opcaoAluguel, totalHorasCustom, itensConsumoSelecionados, currentScreen]);

  useEffect(() => {
    if (currentScreen === 'areaDeReserva' || currentScreen === 'areaDePagamento') {
      window.scrollTo(0, 0);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen === 'telaEstenderReserva') {
      const valorPorHoraAdicional = 100;
      const horasValidas = Math.max(1, horasParaEstender || 1);
      setPrecoExtensao(horasValidas * valorPorHoraAdicional);
    }
  }, [horasParaEstender, currentScreen]);

  const categoriasUnicas = Array.from(new Set(itensConsumoDisponiveis.map(item => item.categoria)));
  categoriasUnicas.sort((a, b) => {
    const ordemFixa: { [key: string]: number } = {
        'Carnes': 1, 'Queijos e Frios': 2, 'Acompanhamentos': 3, 'Para Pizza': 4,
        'Snacks': 5, 'Bebidas não Alcoólicas': 6, 'Cervejas': 7, 'Vinhos': 8,
        'Destilados': 9, 'Outros': 10, 'Adicionais': 11
    };
    return (ordemFixa[a] || 99) - (ordemFixa[b] || 99);
  });
  
  const hojeMinDate = new Date().toISOString().split('T')[0];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      paddingTop: '40px', paddingBottom: '40px', boxSizing: 'border-box'
    }}>
  
      {currentScreen === 'areaDeReserva' && (
        <div className="area-reserva-container">
          <h1>Faça Sua Reserva</h1>
          <form style={{ display: 'flex', flexDirection: 'column', width: '100%' }} onSubmit={handleSubmit}>
            <div className="form-row-inline" style={{ marginBottom: '10px' }}>
              <label htmlFor="reservaData" className="form-label-inline">Data da Reserva:</label>
              <input 
                type="date" 
                id="reservaData" 
                className="form-input-inline" 
                value={selectedDate} 
                onChange={handleDateChange}
                min={hojeMinDate} 
              />
            </div>
            <div className="form-row-inline" style={{ marginBottom: '10px' }}>
              <label htmlFor="reservaHoraEntrada" className="form-label-inline">Hora de Entrada:</label>
              <input 
                type="time" 
                id="reservaHoraEntrada" 
                className="form-input-inline form-input-time-inline" 
                value={selectedTime} 
                onChange={handleTimeChange}
              />
            </div>
            
            <div className="form-section-title">
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
  
            {opcaoAluguel === 'custom' && (
              <div style={{marginBottom: '10px'}}>
                <label htmlFor="totalHorasCustomInput" className="form-section-title" style={{marginTop: '0'}}>Total de Horas Desejado:</label>
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
                  className="form-input-inline"
                  style={{ width: '100px', marginTop: '5px', padding: '8px', fontSize: '0.9em', backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #555', borderRadius: '6px' }}
                />
              </div>
            )}
            
            <div className="consumo-section">
              <h2 className="consumo-section-title">Para Sua Comodidade</h2>
              {categoriasUnicas.map(categoria => (
                <div key={categoria} className="consumo-category-wrapper">
                  <h3 className="consumo-category-title">{categoria}</h3>
                  {itensConsumoDisponiveis
                    .filter(item => item.categoria === categoria)
                    .map(item => {
                      const quantidadeSelecionada = itensConsumoSelecionados[item.id] || 0;
                      return (
                        <div key={item.id} className="consumo-item">
                          <div className="consumo-item-details">
                            <span className="consumo-item-name">{item.nome}</span>
                            <span className="consumo-item-price">R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                          </div>
                          <div className="consumo-item-controls">
                            <button
                              type="button"
                              onClick={() => handleSelecionarItem(item.id, 'decrementar')}
                              className="btn-consumo-control"
                              disabled={quantidadeSelecionada <= 0}
                            >
                              -
                            </button>
                            <span>{quantidadeSelecionada}</span>
                            <button
                              type="button"
                              onClick={() => handleSelecionarItem(item.id, 'incrementar')}
                              className="btn-consumo-control btn-consumo-increment"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                  })}
                </div>
              ))}
            </div>
            
            <label htmlFor="reservaHoraSaida" className="form-section-title" style={{ textAlign: 'center', color: '#00BFFF', marginTop: '5px', marginBottom: '5px' }}>Hora de Saída:</label>
            <input type="time" id="reservaHoraSaida" value={horarioSaida} readOnly style={{ backgroundColor: '#1F1F1F', color: '#FFA500', border: '1px dashed #555', padding: '10px', borderRadius: '8px', fontSize: '1.5em', textAlign: 'center', width: '50%', minWidth: '120px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5em', cursor: 'default' }} />
            <div className="consumo-info-msg">
              Os itens selecionados para sua comodidade estarão disponíveis no local.
            </div>
            <div className="form-section-title" style={{textAlign: 'center', fontSize: '1.3em', marginTop: '10px' }}>Preço Total Estimado: R$ {precoFinal.toFixed(2).replace('.', ',')}</div>
            
            <div style={{marginTop: '20px'}}>
            <button type="button" onClick={confirmPayment}>
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
            <button 
              className="btn-controle btn-abrir"
              onClick={handleAbrirPortao}
            >
              Abrir Portão
            </button>
            <button 
              className="btn-controle btn-estender-reserva"
              onClick={() => setCurrentScreen('telaEstenderReserva')}
            >
              Estender Reserva
            </button>
          </div>
        </div>
      )}
  
      {currentScreen === 'telaEstenderReserva' && (
        <div className="estender-reserva-container">
          <h1>Estender Reserva</h1>
          <div className="info-reserva-atual">
            <span>Sua reserva atual termina às:</span>
            <strong>{horarioSaida || "HH:MM"}</strong> 
          </div>

          <label htmlFor="horas-adicionais-input" className="form-label-estender">
            Quantas horas deseja adicionar?
          </label>
          <input 
            type="number"
            id="horas-adicionais-input"
            className="form-input-estender"
            value={horasParaEstender}
            onChange={(e) => setHorasParaEstender(parseInt(e.target.value, 10) || 1)}
            min="1"
          />

          <div className="info-extensao-resumo">
            <div className="info-extensao-item">
              <span>Novo horário de saída:</span>
              <strong>{horarioSaida ? `${(parseInt(horarioSaida.split(':')[0], 10) + horasParaEstender) % 24}`.padStart(2, '0') + `:${horarioSaida.split(':')[1]}` : 'HH:MM'}</strong>
            </div>
            <div className="info-extensao-item">
              <span>Valor adicional a pagar:</span>
              <strong className="preco-adicional">R$ {precoExtensao.toFixed(2).replace('.', ',')}</strong>
            </div>
          </div>
          
          <button className="btn-confirmar-extensao" onClick={handleConfirmarExtensao}>
            Confirmar e Pagar Extensão
          </button>

          <button className="btn-voltar" onClick={() => setCurrentScreen('telaControleRemoto')}>
            Voltar
          </button>
        </div>
      )}
  
    </div>
  );
}
  
export default App;