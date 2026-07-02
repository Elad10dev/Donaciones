import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './CheckoutForm.css'; // Aquí aplicaremos el diseño temático

export const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    // Solicitar el client_secret a nuestra función Serverless en Vercel
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    
    const { clientSecret } = await response.json();

    // Confirmar el pago en la interfaz
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`El pago falló: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  if (succeeded) {
    return (
      <div className="success-message">
        <h3>¡Gracias por tu donación!</h3>
        <p>Tu aporte ha sido procesado exitosamente y será destinado a los esfuerzos de recuperación.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="donation-form">
      <div className="card-element-container">
        <CardElement options={cardStyle} />
      </div>
      <button disabled={processing || !stripe} className="submit-btn">
        {processing ? 'Procesando...' : `Donar $${amount}`}
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

// Objeto de configuración visual para el iframe de Stripe
const cardStyle = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};