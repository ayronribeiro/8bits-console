import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentPage.css';

const stripePromise = loadStripe('pk_live_51QycdFB79s8Aph4o5iUv0BeIkbQ96pijh5RUvCjPiEOR7tRymFDp8tuiRnbwOqTCxNeFTOQu7AOlri2APlJ7MKLz00YHKZIwgS');

const PaymentForm = ({ onSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getTotal } = useCart();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Erro ao processar pagamento. Tente novamente.');
      console.error('Payment error:', err);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label>Pagamento</label>
        <div className="payment-element-container">
          <PaymentElement />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <button
        type="submit"
        className="pay-button"
        disabled={!stripe || processing}
      >
        {processing ? 'Processando...' : 'Pagar Agora'}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { cart, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (cart.length === 0) {
      window.location.href = '/produtos';
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const amount = getTotal() * 100;
        console.log('Creating payment intent with amount:', amount);
        console.log('Items:', cart);

        const response = await fetch('https://certain-dinosaur-423c97af88.strapiapp.com/api/payment/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            items: cart.map(item => ({
              id: item.id,
              title: item.title,
              price: item.price,
              quantity: item.quantity
            }))
          }),
        });

        const data = await response.json();
        console.log('Payment intent response:', data);

        if (data.error) {
          throw new Error(`${data.error}: ${data.message} (${data.code || 'unknown'})`);
        }
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Detailed error:', err);
        setError(`Erro ao inicializar pagamento: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [cart, getTotal]);

  const handlePaymentSuccess = () => {
    clearCart();
    window.location.href = '/payment-success';
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          <div className="spinner"></div>
          <p>Inicializando pagamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <div className="payment-error">
          <h2>Erro no Pagamento</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Tentar Novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Finalizar Compra</h1>
        
        <div className="order-summary">
          <h2>Resumo do Pedido</h2>
          {cart.map((item) => (
            <div key={item.id} className="order-item">
              <span>{item.title} x {item.quantity}</span>
              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-total">
            <span>Total</span>
            <span>R$ {getTotal().toFixed(2)}</span>
          </div>
        </div>

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm onSuccess={handlePaymentSuccess} clientSecret={clientSecret} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default PaymentPage; 
