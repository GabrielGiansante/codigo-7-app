import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [showReservation, setShowReservation] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false); // Para armazenar se o pagamento foi confirmado

  // Função que lida com o clique no botão de reserva
  const handleReservationClick = () => {
    setShowReservation(true); // Exibe o formulário de reserva
  };

  // Função para simular a confirmação do pagamento
  const confirmPayment = () => {
    // Aqui você pode integrar com um gateway de pagamento, mas por enquanto vamos simular.
    alert("Pagamento confirmado! A reserva será finalizada.");
    setPaymentConfirmed(true); // Marca o pagamento como confirmado
  };

  // Função para salvar a reserva no localStorage
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedDate && selectedTime && paymentConfirmed) {
      const newReservation = { date: selectedDate, time: selectedTime };
      const updatedReservations = [...reservations, newReservation];

      // Salva as reservas no localStorage
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);

      alert('Reserva Confirmada!');
      setShowReservation(false); // Fecha o formulário
    } else if (!paymentConfirmed) {
      alert('Você precisa confirmar o pagamento para finalizar a reserva.');
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  };

  // Carregar as reservas salvas no localStorage
  useEffect(() => {
    const storedReservations = localStorage.getItem('reservations');
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }
  }, []);

  // Verificar se a data e hora estão disponíveis
  const isDateAvailable = (date: string, time: string) => {
    return !reservations.some(
      (reservation) => reservation.date === date && reservation.time === time
    );
  };

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
      {!showReservation ? (
        <>
          <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Sala Preta</h1>

          <button
            style={{
              fontSize: '1.5rem',
              padding: '1rem 2rem',
              backgroundColor: '#222',
              color: '#fff',
              border: '2px solid #555',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: '0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#222'}
            onClick={handleReservationClick}
          >
            Reservar Agora
          </button>
        </>
      ) : (
        <div style={{ width: '80%', maxWidth: '600px', marginTop: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>Faça Sua Reserva</h2>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={handleSubmit}>
            <label style={{ textAlign: 'left' }}>
              Data:
              <input
                type="date"
                style={{ padding: '10px', borderRadius: '5px' }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </label>

            <label style={{ textAlign: 'left' }}>
              Hora:
              <input
                type="time"
                style={{ padding: '10px', borderRadius: '5px' }}
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </label>

            <label style={{ textAlign: 'left' }}>
              Escolha o Pacote:
              <select style={{ padding: '10px', borderRadius: '5px' }}>
                <option value="padrão">Pacote Padrão (Cerveja + Carne)</option>
                <option value="premium">Pacote Premium (Cerveja + Carne + Aperitivos)</option>
              </select>
            </label>

            <button
              type="button"
              onClick={confirmPayment}
              style={{
                padding: '15px',
                backgroundColor: '#444',
                color: '#fff',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                transition: '0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#555'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#444'}
            >
              Confirmar Pagamento
            </button>

            {paymentConfirmed && (
              <button
                type="submit"
                style={{
                  padding: '15px',
                  backgroundColor: '#444',
                  color: '#fff',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  transition: '0.3s',
                  marginTop: '10px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#555'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#444'}
              >
                Finalizar Reserva
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
