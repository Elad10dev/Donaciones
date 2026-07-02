import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from './components/CheckoutForm';
import './App.css';

// Reemplaza con tu clave pública de Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  const [amount, setAmount] = useState(20);

  const amounts = [10, 20, 50, 100];

  return (
    <div className="app-container">
      <header className="hero-section">
        <h1>Ayuda para Venezuela</h1>
        <p>Fondo de emergencia para los damnificados por los recientes sismos.</p>
      </header>

      <main className="donation-panel">
        <h2>Selecciona un monto a donar (USD)</h2>
        <div className="amount-selectors">
          {amounts.map((val) => (
            <button 
              key={val} 
              className={`amount-btn ${amount === val ? 'active' : ''}`}
              onClick={() => setAmount(val)}
            >
              ${val}
            </button>
          ))}
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} />
        </Elements>
      </main>
    </div>
  );
}

export default App;