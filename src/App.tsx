import './App.css';
import { useState, useEffect } from 'react'; // Garanti que useEffect está aqui por causa do seu código

function App() {
  // Seus estados como estavam:
  const [showReservation, setShowReservation] = useState(false); // Mantido, mas não usado ativamente no fluxo do Código 7
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reservations, setReservations] = useState<any[]>([]); // Mantido
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('boasVindas');
  const [telefone, setTelefone] = useState('');
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [opcaoAluguel, setOpcaoAluguel] = useState('4h');
  const [totalHorasCustom, setTotalHorasCustom] = useState(13);
  const [horarioSaida, setHorarioSaida] = useState('');
  const [precoFinal, setPrecoFinal] = useState(600);
  // Suas funções como estavam:
  const handleReservationClick = () => {
    setShowReservation(true); 
  };

  const confirmPayment = () => {
    alert("Pagamento confirmado! A reserva será finalizada.");
    setPaymentConfirmed(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedDate && selectedTime && paymentConfirmed) {
      const newReservation = { date: selectedDate, time: selectedTime };
      const updatedReservations = [...reservations, newReservation];
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      alert('Reserva Confirmada!');
      // setShowReservation(false); // Mantive comentado como pedimos
    } else if (!paymentConfirmed) {
      alert('Você precisa confirmar o pagamento para finalizar a reserva.');
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  };

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

  useEffect(() => { // Mantive descomentado como no seu último envio completo
    const storedReservations = localStorage.getItem('reservations');
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }
  }, []);
  // ... (sua última função, provavelmente handleVerificarCodigo)

// NOVO useEffect para calcular preço e horário de saída
useEffect(() => {
  const calcularReserva = () => {
    let novoPreco = 0;
    let novoHorarioSaida = '';

    if (selectedTime) { // Só calcula se a hora de entrada estiver definida
      const [horasEntrada, minutosEntrada] = selectedTime.split(':').map(Number);
      let horasSaidaCalc = horasEntrada;
      let minutosSaidaCalc = minutosEntrada;

      if (opcaoAluguel === '4h') {
        novoPreco = 600;
        horasSaidaCalc += 4;
      } else if (opcaoAluguel === '12h') {
        novoPreco = 1200;
        horasSaidaCalc += 12;
      } else if (opcaoAluguel === 'custom') {
        // Se totalHorasCustom for 0 (nosso placeholder para 'vazio') ou < 13, usa 13 para o cálculo.
        // Caso contrário, usa o valor de totalHorasCustom.
        const horasParaCalculo = (totalHorasCustom === 0 || totalHorasCustom < 13) ? 13 : totalHorasCustom;
        
        novoPreco = 1200 + (horasParaCalculo - 12) * 100;
        horasSaidaCalc += horasParaCalculo;
      }

      // Ajusta as horas se passarem de 23 (virar o dia)
      if (horasSaidaCalc >= 24) {
        horasSaidaCalc = horasSaidaCalc % 24; // Resto da divisão por 24
        // Poderíamos adicionar um indicador de "+1 dia" aqui se quiséssemos
      }
      
      // Formata a hora de saída para HH:MM
      const horaFormatada = String(horasSaidaCalc).padStart(2, '0');
      const minutoFormatado = String(minutosSaidaCalc).padStart(2, '0');
      novoHorarioSaida = `${horaFormatada}:${minutoFormatado}`;
    } else {
      // Se não há hora de entrada, resetar preço e hora de saída ou manter o default
      // Se opcaoAluguel for '4h' por default, precoFinal já é 600.
      // Se mudar para 12h ou custom sem hora de entrada, o preço não atualiza corretamente.
      // Vamos recalcular o preço base mesmo sem hora de entrada para o select
      if (opcaoAluguel === '4h') novoPreco = 600;
      else if (opcaoAluguel === '12h') novoPreco = 1200;
      else if (opcaoAluguel === 'custom') novoPreco = 1200 + ( (totalHorasCustom >= 13 ? totalHorasCustom : 13) - 12) * 100;
    }

    setPrecoFinal(novoPreco);
    if (selectedTime) { // Só atualiza horário de saída se tiver entrada
         setHorarioSaida(novoHorarioSaida);
    } else {
        setHorarioSaida(''); // Limpa se não tiver hora de entrada
    }
  };

  calcularReserva(); // Chama a função de cálculo

}, [selectedTime, opcaoAluguel, totalHorasCustom]); // Lista de dependências


  // const isDateAvailable = ... (comentado)

  console.log("Tela atual ANTES do return:", currentScreen);

  return (
    <div style={{
      minHeight: '100vh',     
      display: 'flex',        
      flexDirection: 'column',
      alignItems: 'center',   
      justifyContent: 'center' 
    }}>
      {currentScreen === 'boasVindas' && (
        <div className="container"> 
          {console.log("DENTRO do bloco boasVindas")}
          <h1>Código 7</h1> 
          <p className="jargao">Discrição. Comodidade. Praticidade.</p> 
          <button onClick={() => setCurrentScreen('cadastroTelefone')}>
            Entrar 
          </button>
        </div>
      )}

      {currentScreen === 'cadastroTelefone' && (
        <div className="cadastro-container"> 
          {console.log("DENTRO do bloco cadastroTelefone")}
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
        // Adicionei o <div className="cadastro-container"> aqui também para consistência
        <div className="cadastro-container"> 
          {console.log("DENTRO do bloco verificacaoCodigo")}
          <h1>Insira o código recebido</h1>
          <input
            type="text"
            id="codigoInput" 
            placeholder="Digite o código"
            value={codigoDigitado}
            onChange={(e) => setCodigoDigitado(e.target.value)}
            // Removi o style inline daqui, pois o App.css deve cuidar
          />
          <button onClick={handleVerificarCodigo}>
            Confirmar
          </button>
        </div>
      )}

      {currentScreen === 'areaDeReserva' && (
        <> {/* Mantive o fragmento como no seu último código que deu erro, mas o conteúdo interno está corrigido */}
          <div className="cadastro-container"> 
            {console.log("DENTRO do bloco areaDeReserva")}
            <h1>Faça Sua Reserva</h1>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }} onSubmit={handleSubmit}> {/* Ajustei o gap */}
          
          {/* --- Data da Reserva --- */}
          <label htmlFor="reservaData" className="cadastro-info-paragrafo" style={{ textAlign: 'left', marginBottom: '2px' }}>
            Data da Reserva:
          </label>
          <input
            type="date"
            id="reservaData"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {/* --- Hora de Entrada --- */}
          <label htmlFor="reservaHoraEntrada" className="cadastro-info-paragrafo" style={{ textAlign: 'left', marginBottom: '2px' }}>
            Hora de Entrada:
          </label>
          <input
            type="time"
            id="reservaHoraEntrada" // Mudei o id
            value={selectedTime}    // selectedTime ainda é usado para hora de entrada
            onChange={(e) => setSelectedTime(e.target.value)}
          />

          {/* --- Opções de Aluguel (Radio Buttons) --- */}
          <div className="cadastro-info-paragrafo" style={{ textAlign: 'left', marginTop: '15px', marginBottom: '5px' }}>Selecione a Duração:</div>
          <div style={{ textAlign: 'left', marginBottom: '15px' }}> {/* Container para os radios */}
            <div>
              <input 
                type="radio" 
                id="opcao4h" 
                name="opcaoAluguel" 
                value="4h" 
                checked={opcaoAluguel === '4h'} 
                onChange={(e) => setOpcaoAluguel(e.target.value)}
              />
              <label htmlFor="opcao4h" style={{ color: '#FFF', marginLeft: '5px' }}>4 Horas - R$ 600,00</label>
            </div>
            <div>
              <input 
                type="radio" 
                id="opcao12h" 
                name="opcaoAluguel" 
                value="12h" 
                checked={opcaoAluguel === '12h'} 
                onChange={(e) => setOpcaoAluguel(e.target.value)}
              />
              <label htmlFor="opcao12h" style={{ color: '#FFF', marginLeft: '5px' }}>12 Horas - R$ 1.200,00</label>
            </div>
            <div>
              <input 
                type="radio" 
                id="opcaoCustom" 
                name="opcaoAluguel" 
                value="custom" 
                checked={opcaoAluguel === 'custom'} 
                onChange={(e) => setOpcaoAluguel(e.target.value)}
              />
              <label htmlFor="opcaoCustom" style={{ color: '#FFF', marginLeft: '5px' }}>Acima de 12 Horas (R$ 100,00/hora adicional)</label>
            </div>
          </div>

          {/* --- Input para Total de Horas (se 'custom' selecionado) --- */}
          {opcaoAluguel === 'custom' && (
            <>
              <label htmlFor="totalHorasCustomInput" className="cadastro-info-paragrafo" style={{ textAlign: 'left', marginBottom: '2px' }}>
                Total de Horas Desejado:
              </label>
              <input
                type="number"
                id="totalHorasCustomInput"
                min="13" // O navegador tentará impor isso na submissão/validação visual
                // O 'value' agora pode ser uma string vazia se o usuário apagar
                // ou o número. Se totalHorasCustom for 0 (nosso placeholder para 'vazio'), mostramos string vazia.
                value={totalHorasCustom === 0 ? '' : totalHorasCustom.toString()}
                onChange={(e) => {
                  const stringValue = e.target.value;
                  if (stringValue === '') {
                    setTotalHorasCustom(0); // Usa 0 para representar "campo vazio" no estado
                  } else {
                    const numValue = parseInt(stringValue);
                    if (!isNaN(numValue)) {
                      setTotalHorasCustom(numValue); // Permite qualquer número ser digitado no estado
                    }
                    // Se o usuário digitar letras, não faz nada, mantendo o valor anterior
                  }
                }}
                onBlur={() => { // Quando o usuário sai do campo (perde o foco)
                  if (totalHorasCustom < 13 && totalHorasCustom !== 0) { // Se for menor que 13 E não for o nosso "vazio"
                    setTotalHorasCustom(13); // Corrige para 13
                  } else if (totalHorasCustom === 0) { // Se saiu do campo e estava "vazio"
                    setTotalHorasCustom(13); // Define para 13
                  }
                }}
              />
            </>
          )}

          {/* --- Hora de Saída (Calculada - desabilitado) --- */}
          <label htmlFor="reservaHoraSaida" className="cadastro-info-paragrafo"             style={{ 
              textAlign: 'center', // CENTRALIZA O TEXTO DO LABEL
              color: '#00BFFF',  // UMA COR DE DESTAQUE (AZUL CLARO VIVO - "DeepSkyBlue") - ESCOLHA A COR QUE QUISER
              fontWeight: 'bold', // DEIXA EM NEGRITO
              fontSize: '1.1em',  // UM POUCO MAIOR
              display: 'block',   // PARA OCUPAR A LARGURA E PERMITIR CENTRALIZAÇÃO DO BLOCO SE NECESSÁRIO
              marginBottom: '5px', 
              marginTop: '20px'   // AUMENTEI A MARGEM SUPERIOR PARA SEPARAR MAIS
            }}>
            Hora de Saída (Estimada):
          </label>
          <input
            type="time"
            id="reservaHoraSaida"
            value={horarioSaida} // Usará o estado horarioSaida
            readOnly // Para o usuário não editar
            style={{
              backgroundColor: '#1F1F1F',
              color: '#FFA500',           // COR DO NÚMERO LARANJA VIVO - ESCOLHA A COR QUE QUISER
              border: '1px dashed #555',
              padding: '10px',           // Reduzi um pouco o padding vertical para o texto parecer maior
              borderRadius: '8px',
              fontSize: '1.5em',         // AUMENTA O TAMANHO DA FONTE DO NÚMERO
              textAlign: 'center',
              width: '50%',
              minWidth: '120px',         // Garante uma largura mínima
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '1.5em',
              cursor: 'default'
            }}
          />
          
          {/* --- Preço Final (Calculado) --- */}
          <div className="cadastro-info-paragrafo" style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2em' }}>
            Preço Total Estimado: R$ {precoFinal.toFixed(2).replace('.', ',')}
          </div>

          {/* --- Botões --- */}
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
    </div> // FECHAMENTO DO DIV PRINCIPAL
  ); // FECHAMENTO DO RETURN
} // FECHAMENTO DA FUNÇÃO APP

export default App;